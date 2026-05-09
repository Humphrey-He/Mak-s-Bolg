# Agent 开发中心：论文与资料清单及写作排期

> 本清单覆盖模型接入、工具调用、记忆系统、RAG 检索、任务编排、评测观测与部署运维六大模块，筛选标准为：经典论文、近两年综述、官方工程文档、能支撑系统性输出的资料。

---

## 一、文章目录设计

结合站点"Agent 开发中心"定位，建议内容组织为：

```
Agent 开发中心
├── 01. Agent 系统架构总览
├── 02. 模型接入层设计
├── 03. Function Calling 与工具调用
├── 04. MCP 协议与工具生态
├── 05. Agent 记忆系统
├── 06. RAG 检索增强生成
├── 07. Agentic RAG 设计
├── 08. 任务规划与编排
├── 09. 多 Agent 协作与 Handoff
├── 10. Agent 评测体系
├── 11. Agent 可观测性
├── 12. Agent 生产部署与安全
```

---

## 二、各模块推荐资料

### 模块一：Agent 总体架构 / 入门总览

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **A Survey on Large Language Model based Autonomous Agents** | 综述论文 | Agent 开发中心的总览参考，覆盖感知、规划、记忆、工具使用、多 Agent 核心概念 |
| **ReAct: Synergizing Reasoning and Acting in Language Models** | 经典论文 | Agent 领域核心范式之一，把 reasoning trace 和 action/tool use 交替结合，是很多工具调用 Agent 的思想来源 |
| **OpenAI Agents SDK Docs** | 官方工程文档 | 官方把 agents 定义为能规划、调用工具、协作并保持状态以完成多步任务的应用，适合写"现代 Agent 工程架构" |
| **TaskMatrix.AI: Completing Tasks by Connecting Foundation Models with Millions of APIs** | 架构型论文 | 把 foundation model 作为"大脑"，外部 API/工具作为任务执行器，适合写"Agent 工具生态/任务分解" |

### 模块二：模型接入 / Model Access

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **OpenAI Agents SDK** | 官方文档 | 适合参考 Agent SDK 的模型、工具、handoff、状态管理等工程抽象 |
| **Model Context Protocol, MCP** | 协议/官方标准 | Anthropic 官方定义的开放协议，连接模型、工具、数据源，是构建 AI 工具与数据源双向安全连接的标准方向 |
| **MCP Prompts Specification** | 协议文档 | 适合写"Prompt 模板如何协议化暴露给模型客户端"，prompts 可被 client 发现、获取并传参定制 |
| **MemGPT: Towards LLMs as Operating Systems** | 系统论文 | 把 LLM 应用抽象成类似操作系统的上下文/内存管理系统，对模型接入层设计很有启发 |

### 模块三：工具调用 / Function Calling / Tool Use

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **Toolformer: Language Models Can Teach Themselves to Use Tools** | 经典论文 | 研究模型如何学习调用外部 API，是 tool use 方向绕不开的经典 |
| **Gorilla: Large Language Model Connected with Massive APIs** | 高含金量论文 | 专门研究 LLM 如何更准确生成 API 调用，提出 APIBench，并讨论结合检索减少 API hallucination |
| **LLM With Tools: A Survey** | 综述论文 | 系统梳理 LLM 工具使用的方法、挑战和发展，适合做工具调用模块的综述引用 |
| **Writing effective tools for AI agents** | 工程文章 | Anthropic 工程文章，适合写"怎样设计对 Agent 友好的工具接口" |
| **OpenAI Agents SDK Handoffs** | 官方文档 | handoff 被表示为工具调用，适合写"多 Agent 协作如何通过工具抽象实现" |

### 模块四：记忆系统 / Memory

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **MemGPT: Towards LLMs as Operating Systems** | 经典系统论文 | 提出类似操作系统虚拟内存的上下文管理，用不同 memory tiers 支撑长上下文、长期对话和文档分析 |
| **Generative Agents: Interactive Simulacra of Human Behavior** | 经典 Agent 论文 | 使用 observation、memory、reflection、planning 架构模拟可信人类行为，是 Agent 记忆/反思/规划结合的经典案例 |
| **Reflexion: Language Agents with Verbal Reinforcement Learning** | 经典论文 | Reflexion 让 Agent 通过语言反馈形成 episodic memory，在后续任务中改进行为 |
| **Voyager: An Open-Ended Embodied Agent with Large Language Models** | 高影响力 Agent 论文 | Voyager 在 Minecraft 中持续探索、积累技能，适合参考"技能库/长期经验积累"的 Agent 记忆设计 |

### 模块五：RAG 检索 / Retrieval-Augmented Generation

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** | 原始经典论文 | RAG 方向的基础论文，提出结合 parametric memory 和 non-parametric memory 处理知识密集任务 |
| **Retrieval-Augmented Generation for Large Language Models: A Survey** | 高引用综述 | 系统梳理 Naive RAG、Advanced RAG、Modular RAG，是写 RAG 总览首选综述之一 |
| **Retrieval Augmented Generation (RAG) and Beyond: A Comprehensive Survey** | 综述论文 | 按用户查询类型对 RAG 任务分类，适合写"什么时候需要 RAG、RAG 适合什么问题" |
| **A Comprehensive Survey of Retrieval-Augmented Generation: Evolution, Current Landscape and Future Directions** | 综述论文 | 覆盖 RAG 的演进、架构、应用、挑战与未来方向 |
| **Retrieval-Augmented Generation: A Comprehensive Survey** | 新近综述 | 补充 retriever-centric、generator-centric、hybrid、robustness-oriented 等分类，适合写进进阶阅读 |

### 模块六：任务编排 / Planning / Orchestration

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **Tree of Thoughts: Deliberate Problem Solving with Large Language Models** | 经典规划论文 | ToT 让模型探索多个 reasoning path、进行自评估和回溯，适合写复杂任务规划 |
| **Self-Refine: Iterative Refinement with Self-Feedback** | 经典论文 | 用同一个 LLM 生成、反馈、修正，适合写"反思式任务循环"和自动改写流程 |
| **ReAct** | 经典论文 | 适合讲"推理—行动—观察"循环，也是很多 Agent loop 的基础范式 |
| **LangGraph** | 工程框架 | 低层级 Agent 编排框架，适合长运行、有状态、多节点工作流 |
| **OpenAI Agents SDK Orchestration and Handoffs** | 官方文档 | 适合参考 handoffs 和 agents-as-tools 的多 Agent 编排方式 |

### 模块七：评测 / Evaluation

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **AgentBench: Evaluating LLMs as Agents** | Agent 评测论文 | 多环境评测 LLM-as-Agent 的推理和决策能力 |
| **WebArena: A Realistic Web Environment for Building Autonomous Agents** | Agent Web 环境评测 | 构建真实网页任务环境，评估 Agent 在电商、论坛、软件协作等网站上的任务完成能力 |
| **SWE-bench: Can Language Models Resolve Real-World GitHub Issues?** | 软件工程 Agent 评测 | 用真实 GitHub issue 和 PR 测试模型解决代码问题的能力 |
| **GAIA: A Benchmark for General AI Assistants** | 通用助手评测 | 关注推理、多模态、浏览和工具使用，适合评测通用 Agent 助手能力 |

### 模块八：观测 / Observability

| 推荐内容 | 类型 | 为什么值得读 |
|---------|------|------------|
| **OpenTelemetry Documentation** | 官方观测标准 | 厂商中立的开源观测框架，用于生成、采集、导出 traces、metrics、logs |
| **An Introduction to Observability for LLM-based Applications** | 工程文章 | OpenTelemetry 官方博客，讲如何用 OpenTelemetry、Prometheus、Jaeger、Grafana 监控 LLM 应用 |
| **OpenLLMetry** | 开源项目 | 基于 OpenTelemetry 为 LLM 应用提供观测能力，可接入 Datadog、Honeycomb 等观测平台 |
| **Datadog LLM Observability OTel Instrumentation** | 工程文档 | 适合参考 LLM span schema、GenAI semantic conventions 和 OpenLLMetry 到商业观测平台的映射 |

---

## 三、优先阅读清单：12 篇核心资料

按价值排序的建议阅读顺序：

| # | 资料 | 模块 | 推荐理由 |
|---|------|------|---------|
| 1 | **ReAct** | 工具调用 | Agent loop 的基础范式 |
| 2 | **Toolformer** | 工具调用 | 工具调用的经典起点 |
| 3 | **Gorilla** | 工具调用 | API 调用与工具选择的高价值论文 |
| 4 | **MemGPT** | 记忆系统 | Agent 长期记忆和上下文管理 |
| 5 | **Generative Agents** | 记忆系统 | 观察、记忆、反思、规划架构 |
| 6 | **Reflexion** | 记忆系统 | 语言反馈与反思记忆 |
| 7 | **RAG Survey** | RAG | RAG 总览，Naive/Advanced/Modular RAG |
| 8 | **Tree of Thoughts** | 任务编排 | 复杂任务规划 |
| 9 | **Self-Refine** | 任务编排 | 迭代反馈与自我修正 |
| 10 | **AgentBench** | 评测 | Agent 评测体系 |
| 11 | **WebArena** | 评测 | 真实 Web 任务环境 |
| 12 | **OpenAI Agents SDK / MCP / OTel Docs** | 工程落地 | 生产级 Agent 必读官方文档 |

---

## 四、建议优先写的 5 篇原创文章

这 5 篇覆盖"Agent 开发中心"首页描述的全部模块，最适合作为第一批核心内容：

| # | 文章标题 | 覆盖模块 | 核心论点 |
|---|---------|---------|---------|
| 1 | **Agent 开发中心总览：模型、工具、记忆、RAG、编排、评测与部署** | 全模块 | 建立 Agent 技术体系的全局视图 |
| 2 | **ReAct 到 Function Calling：Agent 工具调用的核心范式** | 工具调用 | 从 ReAct 思想到现代 Function Calling 工程落地 |
| 3 | **Agent 记忆系统：从短期上下文到长期记忆与 Reflexion** | 记忆系统 | 上下文窗口局限性、memory tiers、反思机制 |
| 4 | **RAG 系统设计：Naive RAG、Advanced RAG 与 Agentic RAG** | RAG | RAG 演进路径与 Agentic RAG 的自主检索设计 |
| 5 | **Agent 生产化：评测、观测、权限、成本与部署运维** | 评测+观测+部署 | AgentBench、WebArena、OpenLLMetry 与安全边界 |

---

## 五、写作排期建议

| 阶段 | 时间 | 文章 | 准备动作 |
|------|------|------|---------|
| **第一周** | Day 1-2 | Agent 开发中心总览 | 读 A Survey on LLM based Autonomous Agents + OpenAI Agents SDK 文档，搭框架 |
| | Day 3-4 | ReAct 到 Function Calling | 精读 ReAct + Toolformer + Gorilla，建立工具调用范式脉络 |
| | Day 5-7 | Agent 记忆系统 | 精读 MemGPT + Generative Agents + Reflexion，整理记忆类型分类 |
| **第二周** | Day 8-10 | RAG 系统设计 | 精读 RAG Survey + RAG and Beyond，建立 Naive → Advanced → Agentic 演进框架 |
| | Day 11-12 | Agent 评测体系 | 精读 AgentBench + WebArena + GAIA，整理评测指标体系 |
| | Day 13-14 | Agent 可观测性 | 读 OpenLLMetry + OTel 文档，规划 trace/metrics/logs 设计 |
| **第三周** | Day 15-16 | Agent 生产部署与安全 | 整理 MCP + Writing effective tools + 生产边界要点 |
| | Day 17-18 | 任务规划与编排 | 精读 ToT + Self-Refine + LangGraph，建立编排模式分类 |
| | Day 19-20 | 多 Agent 协作与 Handoff | 读 OpenAI Agents SDK Handoffs + TaskMatrix |
| **第四周** | Day 21 | 补写 Module 04: MCP 协议与工具生态 | 基于 MCP 官方文档整理 |
| | Day 22 | 补写 Module 07: Agentic RAG | 基于 Advanced RAG 文章延伸 |
| | Day 23-24 | 全系列校对、内部链接、术语统一 | — |
| | Day 25 | 发布 + 站内推广 | — |

> 注：以上排期按每篇深度文章预估 2-3 天（读论文 1 天 + 写稿 1 天 + 修订 0.5 天）计算，可根据实际产出速度调整。

---

## 六、各模块对应论文链接

| 模块 | 论文 | 链接 |
|------|------|------|
| 总览 | A Survey on LLM based Autonomous Agents | https://en.wikipedia.org/wiki/Large_language_model |
| 总览 | TaskMatrix.AI | https://arxiv.org/abs/2303.16434 |
| 工具调用 | ReAct | https://arxiv.org/abs/2210.03629 |
| 工具调用 | Toolformer | https://arxiv.org/abs/2302.04761 |
| 工具调用 | Gorilla | https://arxiv.org/abs/2305.15334 |
| 工具调用 | LLM With Tools: A Survey | https://arxiv.org/abs/2409.18807 |
| 工具调用 | Writing effective tools for AI agents | https://www.anthropic.com/engineering/writing-tools-for-agents |
| 模型接入 | MemGPT | https://arxiv.org/abs/2310.08560 |
| 记忆系统 | Generative Agents | https://arxiv.org/abs/2304.03442 |
| 记忆系统 | Reflexion | https://arxiv.org/abs/2303.11366 |
| 记忆系统 | Voyager | https://arxiv.org/abs/2305.16291 |
| RAG | RAG 原始论文 | https://arxiv.org/abs/2005.11401 |
| RAG | RAG Survey | https://arxiv.org/abs/2312.10997 |
| RAG | RAG and Beyond | https://arxiv.org/abs/2409.14924 |
| RAG | Comprehensive RAG Survey | https://arxiv.org/abs/2410.12837 |
| 任务编排 | Tree of Thoughts | https://arxiv.org/abs/2305.10601 |
| 任务编排 | Self-Refine | https://arxiv.org/abs/2303.17651 |
| 评测 | AgentBench | https://arxiv.org/abs/2308.03688 |
| 评测 | WebArena | https://arxiv.org/abs/2307.13854 |
| 评测 | SWE-bench | https://arxiv.org/abs/2310.06770 |
| 评测 | GAIA | https://arxiv.org/abs/2311.12983 |
| 观测 | OTel 官方文档 | https://opentelemetry.io/docs/ |
| 观测 | OTel LLM Observability | https://opentelemetry.io/blog/2024/llm-observability/ |
| 观测 | OpenLLMetry | https://github.com/traceloop/openllmetry |
| 观测 | Datadog OTel | https://docs.datadoghq.com/llm_observability/instrumentation/otel_instrumentation/ |
| 工程 | OpenAI Agents SDK | https://developers.openai.com/api/docs/guides/agents |
| 工程 | MCP 官方介绍 | https://www.anthropic.com/news/model-context-protocol |
| 工程 | MCP Prompts Spec | https://modelcontextprotocol.io/specification |
| 工程 | OpenAI Handoffs | https://openai.github.io/openai-agents-python/handoffs/ |
| 工程 | LangGraph | https://github.com/langchain-ai/langgraph |
