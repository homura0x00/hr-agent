from pathlib import Path
from typing import List

from langchain_deepseek import ChatDeepSeek
from pydantic import BaseModel, Field
import pymupdf

from langgraph.graph import StateGraph, START, END
from langchain.messages import HumanMessage

"""
自动化流程
1. 读取简历pdf
    根据每个岗位需要创建对应的文件夹；
    将候选人的简历pdf存至其中；
2. 岗位基本要求过滤
      学位、技能、工作年限
3. 经历（实习、工作、项目）
4. 打分，rank，推给hr
5. HR最终审核
6. 列出待面试的候选人列表，即hr接下来要发出面试邀请和安排面试进程的任务列表
    """


# 解析配置
MAX_RESUME_CHARS = 8000  # 单份简历截断长度，防止 token 爆掉

ROOT_DIR = Path(__file__).parent.parent
UPLOADS_DIR = ROOT_DIR / "uploads"
JOB_DIR_NAME = 'python'


UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Resume(BaseModel):
    """解析后的简历"""
    filename: str
    filepath: str
    text: str
    char_count: int

class CandidateScore(BaseModel):
    """单个候选人的打分结果"""
    filename: str
    candidate_name: str = Field(description="候选人姓名，从简历中提取")
    score: int = Field(ge=0, le=100, description="匹配度总分 0-100")
    summary: str = Field(description="一句话总结候选人")
    matched: List[str] = Field(description="匹配上的点")
    gaps: List[str] = Field(description="不匹配/缺失的点")
    highlights: List[str] = Field(description="简历亮点")
    risks: List[str] = Field(description="HR 需要注意的风险")
    interview_questions: List[str] = Field(description="针对该候选人的面试问题")


class BatchReport(BaseModel):
    """批量对比报告"""
    job_name: str
    total: int
    ranking: List[CandidateScore] = Field(description="按分数从高到低排序")
    recommendation: str = Field(description="给 HR 的整体推荐建议")
    jd_diagnosis: str = Field(description="基于候选人群体对岗位要求的诊断")


class AgentState(BaseModel):
    """LangGraph 的状态"""
    job_name: str
    jd: str
    resumes: List[Resume] = []
    scores: List[CandidateScore] = []
    report: BatchReport | None = None
    error: str | None = None

def parse_pdf(filepath: Path):
    """用 PyMuPDF 提取 PDF 全文"""
    doc = pymupdf.open(filepath)
    try:
        parts = []
        for page in doc:
            parts.append(page.get_text())
        text = "\n".join(parts)
    finally:
        doc.close()

    # 清理：去掉过多空行
    lines = [line.strip() for line in text.splitlines()]
    text = "\n".join(line for line in lines if line)

    # 截断，防止 token 爆掉
    if len(text) > MAX_RESUME_CHARS:
        text = text[:MAX_RESUME_CHARS] + "\n...[已截断]"

    return text

def load_resumes(job_dir: Path) -> list[Resume]:
    """加载某个岗位目录下所有 PDF 简历"""
    if not job_dir.exists():
        raise FileNotFoundError(f"目录不存在: {job_dir}")

    pdf_files = sorted(job_dir.glob("*.pdf"))
    if not pdf_files:
        raise FileNotFoundError(f"目录下没有 PDF: {job_dir}")

    resumes = []
    for pdf in pdf_files:
        try:
            text = parse_pdf(pdf)
            resumes.append(Resume(
                filename=pdf.name,
                filepath=str(pdf),
                text=text,
                char_count=len(text),
            ))
        except Exception as e:
            print(f"⚠️  解析失败 {pdf.name}: {e}")

    return resumes

SCORE_PROMPT = """你是一位资深招聘专家。请根据岗位描述（JD），评估这份简历的匹配度。

## 岗位描述
{jd}

## 简历内容（来自文件：{filename}）
{resume_text}

请客观打分，并给出有依据的理由。
- score: 0-100，60 分以下表示明显不匹配
- matched: 具体匹配上的技能/经验，不要空泛
- gaps: 具体缺失的点，不要空泛
- highlights: 简历中的亮点（开源、大厂、项目质量等）
- risks: HR 需要注意的风险（跳槽频繁、经验断层、薪资预期等）
- interview_questions: 针对该候选人 gap 定制的 3-5 个面试问题
"""


REPORT_PROMPT = """你是一位资深招聘顾问。以下是 {job_name} 岗位的 {total} 位候选人的评估结果。

## 岗位描述
{jd}

## 候选人评估（已按分数排序）
{scores_text}

请给出：
1. recommendation: 给 HR 的整体推荐建议——优先面谁、备选是谁、为什么
2. jd_diagnosis: 基于这批候选人的整体情况，诊断岗位要求是否合理（比如要求过高、薪资偏低、技能组合罕见等）

要具体、有依据，不要套话。
"""

llm = ChatDeepSeek(
    model="deepseek-v4-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

def node_load_resumes(state: AgentState) -> dict:
    print(f"\n📂 加载岗位【{state.job_name}】的简历...")
    job_dir = UPLOADS_DIR / state.job_name
    resumes = load_resumes(job_dir)
    print(f"✅ 加载了 {len(resumes)} 份简历")
    return {"resumes": resumes}

# ---------- 节点 2：逐份打分（并行） ----------
def node_score_resumes(state: AgentState) -> dict:
    print(f"\n🤖 开始逐份打分（共 {len(state.resumes)} 份）...")
    scores = []

    for i, resume in enumerate(state.resumes, 1):
        print(f"  [{i}/{len(state.resumes)}] 分析 {resume.filename}...")
        try:
            score = _score_one(resume, state.jd)
            scores.append(score)
            print(f"      → {score.candidate_name}: {score.score} 分")
        except Exception as e:
            print(f"      ❌ 失败: {e}")

    # 按分数排序
    scores.sort(key=lambda s: s.score, reverse=True)
    return {"scores": scores}

def _score_one(resume, jd: str) -> CandidateScore:
    """调用 LLM 给单份简历打分，返回结构化结果"""
    prompt = SCORE_PROMPT.format(
        jd=jd,
        filename=resume.filename,
        resume_text=resume.text,
    )

    structured_llm = llm.with_structured_output(CandidateScore)
    result = structured_llm.invoke([HumanMessage(content=prompt)])

    # 补上 filename（LLM 不一定能准确返回）
    result.filename = resume.filename
    return result

# ---------- 节点 3：生成批量对比报告 ----------
def node_generate_report(state: AgentState) -> dict:
    print(f"\n📊 生成对比报告...")

    if not state.scores:
        return {"error": "没有可用的打分结果"}

    scores_text = "\n\n".join(
        f"【{s.candidate_name}】{s.score} 分（{s.filename}）\n"
        f"总结：{s.summary}\n"
        f"匹配：{', '.join(s.matched)}\n"
        f"缺失：{', '.join(s.gaps)}"
        for s in state.scores
    )

    prompt = REPORT_PROMPT.format(
        job_name=state.job_name,
        total=len(state.scores),
        jd=state.jd,
        scores_text=scores_text,
    )

    structured_llm = llm.with_structured_output(BatchReport)
    report = structured_llm.invoke([HumanMessage(content=prompt)])

    # 补上元信息
    report.job_name = state.job_name
    report.total = len(state.scores)
    report.ranking = state.scores

    return {"report": report}

# ---------- 构建 LangGraph ----------
def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("load_resumes", node_load_resumes)
    graph.add_node("score_resumes", node_score_resumes)
    graph.add_node("generate_report", node_generate_report)

    graph.add_edge(START, "load_resumes")
    graph.add_edge("load_resumes", "score_resumes")
    graph.add_edge("score_resumes", "generate_report")
    graph.add_edge("generate_report", END)

    return graph.compile()

def main():

    JD_CONTENT = """
工作年限: 3年以上
技能要求: Python, LangGraph, FastAPI / Flask / Django 其中一个Web框架
    """
    # 初始状态
    initial_state = AgentState(job_name="python", jd=JD_CONTENT)

    # 跑 Agent
    graph = build_graph()
    graph.invoke(initial_state)

if __name__ == "__main__":
    main()
