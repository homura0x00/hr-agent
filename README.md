# 人力资源 HR Assistant

用于人力资源管理的辅助型AI助手，覆盖简历解析、人岗匹配、智能对话、面试辅助、数据分析。

## 流程

```text
Web 投递 → 简历解析 → 规则机筛 → AI 精评 → HR 审核
```

## 技术栈

- 编排：LangGraph
- 后端：FastAPI + SQLModel
- 数据库：Supabase (PostgreSQL)
- 解析：PyMuPDF / PaddleOCR
- LLM：Claude / GPT-4o
- 前端：Next.js


## 核心设计

- 分级解析：电子版用 PyMuPDF，扫描件用 OCR，复杂版面才上视觉模型
- 分层筛选：规则引擎先淘汰 70%，LLM 只评剩余 30%
- 非阻塞审核：LangGraph interrupt + checkpointer，HR 随时审、不卡流程
- 确定性计算不进 LLM 循环：解析、过滤写成固定节点，省 token


## 模块

| 模块	| 说明 |
|---|---|
| 简历解析 | PDF → 结构化字段 |
| 人岗匹配 | 规则 + 向量召回 + LLM 精评 |
| 智能对话 | RAG 话术库 + 任务型对话 |
| 面试辅助 | 个性化面试题生成 |
| 数据分析 | 漏斗、周期、渠道 ROI |


## 快速开始

```bash
git clone ...
cd ...
pip install -r requirements.txt
```

配置 .env：
```text
DATABASE_URL=postgresql://...
OPENAI_API_KEY=...
```

```bash
uvicorn main:app --reload
```
