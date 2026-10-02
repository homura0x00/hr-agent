# 企业招聘管理平台（施工中）

- Version: 0.1.0

用于企业人力资源管理的AI辅助型平台，覆盖简历解析、人岗匹配、智能对话、面试辅助、数据分析。通过规则过滤+AI辅助匹配的形式配合HR高效完成

## 流程

```text
Web 投递 → 简历解析 → 规则机筛 → AI 精评 → HR 审核
```

## 技术栈

- 后端：FastAPI + SQLModel
- 数据库：PostgreSQL
- 解析：PyMuPDF / PaddleOCR
- LLM：DeepSeek-V4-Flash + LangGraph
- 前端：React-Router + heroUI


## 核心设计

- 分级解析：电子版用 PyMuPDF，扫描件用 OCR，复杂版面才上视觉模型
- 分层筛选：规则引擎先筛选硬指标，LLM 只评剩余 30%
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
