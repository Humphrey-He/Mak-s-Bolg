import type { Lang } from "@/lib/i18n";

export const copy = {
  zh: {
    nav: [
      { key: "home", label: "首页", hint: "Home", href: "/" },
      { key: "blog", label: "文章", hint: "Blog", href: "/blog" },
      { key: "projects", label: "项目", hint: "Projects", href: "/projects" },
      { key: "agent", label: "Agent", hint: "AI Dev", href: "/agent" },
      { key: "readings", label: "阅读", hint: "Readings", href: "/readings" },
      { key: "backend", label: "后端", hint: "Backend", href: "/backend" },
      { key: "about", label: "关于", hint: "About", href: "/about" },
      { key: "message", label: "留言", hint: "Message", href: "/message" }
    ],
    badge: "书鸿的个人技术空间 · Juno Mak Digital Garden",
    heroTitle: "书鸿",
    heroSubtitle: "在代码、架构与文字之间构建秩序",
    heroDesc: "这里记录后端工程、云原生、API 网关、缓存系统、对象存储与 AI Agent 的工程化实践。",
    readPosts: "阅读文章",
    viewProjects: "查看项目",
    leaveMessage: "留言交流",
    postsTitle: "文章流",
    postsSubtitle: "后台精选 Top 5 与全部文章检索。",
    searchPlaceholder: "搜索文章、标签、工程实践...",
    noResult: "没有匹配的文章，换个关键词试试。",
    backendTitle: "后端优先设计",
    backendDesc: "先设计数据模型、内容流、搜索、精选、统计、订阅和后台管理，再逐步接入前端。",
    projectTitle: "项目作品集",
    projectDesc: "聚焦后端基础设施、缓存系统、API 网关、对象存储与 AI Agent 工程化。",
    agentTitle: "Agent 开发中心",
    agentDesc: "模型接入、工具调用、记忆系统、RAG 检索、任务编排、评测观测与部署运维。",
    aboutTitle: "技术主线",
    aboutDesc: "后端与云原生方向开发者，关注高并发系统、网关插件、缓存架构、对象存储、Kubernetes 与 AI Agent 工程化。",
    messageTitle: "给书鸿留言",
    messageDesc: "后续可接入评论系统、邮件通知、GitHub Issues 或自建留言 API。",
    langLabel: "中 / EN",
    backHome: "回到首页"
  },
  en: {
    nav: [
      { key: "home", label: "Home", hint: "首页", href: "/" },
      { key: "blog", label: "Blog", hint: "文章", href: "/blog" },
      { key: "projects", label: "Projects", hint: "项目", href: "/projects" },
      { key: "agent", label: "Agent", hint: "AI Dev", href: "/agent" },
      { key: "readings", label: "Readings", hint: "阅读", href: "/readings" },
      { key: "backend", label: "Backend", hint: "后端", href: "/backend" },
      { key: "about", label: "About", hint: "关于", href: "/about" },
      { key: "message", label: "Message", hint: "留言", href: "/message" }
    ],
    badge: "Juno Mak's Technical Space · 书鸿 Digital Garden",
    heroTitle: "Juno Mak",
    heroSubtitle: "Building order across code, architecture, and words",
    heroDesc: "A personal engineering blog for backend systems, cloud native, API gateways, cache, object storage and AI Agent engineering.",
    readPosts: "Read Posts",
    viewProjects: "View Projects",
    leaveMessage: "Leave Message",
    postsTitle: "Post Stream",
    postsSubtitle: "Admin curated Top 5 plus full article search.",
    searchPlaceholder: "Search posts, tags, engineering notes...",
    noResult: "No matching posts. Try another keyword.",
    backendTitle: "Backend-First Design",
    backendDesc: "Design data models, content flow, search, curation, analytics, subscription and admin management first.",
    projectTitle: "Project Portfolio",
    projectDesc: "Backend infrastructure, cache systems, API gateways, object storage, and AI Agent engineering.",
    agentTitle: "Agent Development Center",
    agentDesc: "Model adapters, tool calling, memory, RAG retrieval, task orchestration, evaluation, observability and deployment.",
    aboutTitle: "Technical Threads",
    aboutDesc: "Backend and cloud-native developer focused on high concurrency, gateway plugins, cache architecture, object storage, Kubernetes and AI Agent engineering.",
    messageTitle: "Message Juno Mak",
    messageDesc: "Later this can integrate comments, email notification, GitHub Issues, or a self-hosted message API.",
    langLabel: "EN / 中",
    backHome: "Home"
  }
} as const;

export type Copy = typeof copy[Lang];
