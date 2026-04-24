export const backendDesignModels = [
  {
    name: "Post",
    fields: "id, slug, title, summary, content, status, visibility, published_at",
    desc: { zh: "文章主体，支持草稿、定时发布、归档、SEO 摘要和多语言扩展。", en: "Main post entity with drafts, scheduled publishing, archive, SEO summary and i18n extension." }
  },
  {
    name: "PostTopRank",
    fields: "post_id, rank, reason, start_at, end_at, enabled",
    desc: { zh: "后台人工选择 Top5 的核心表，前端文章流只读取启用中的前五条。", en: "Admin-curated Top 5 table. The frontend carousel reads only enabled top posts." }
  },
  {
    name: "Tag / Category",
    fields: "id, name, slug, parent_id, weight, color",
    desc: { zh: "分类和标签体系，支撑检索、聚合、推荐和文章归档。", en: "Taxonomy system for search, aggregation, recommendation and archives." }
  },
  {
    name: "EventLog",
    fields: "event_type, path, post_id, referrer, user_agent, created_at",
    desc: { zh: "访问统计、阅读完成率、热门文章和推荐排序的基础事件表。", en: "Event table for analytics, completion rate, trending posts and ranking." }
  }
];

export const backendApiGroups = [
  {
    group: "Public Content API",
    apis: ["GET /api/posts", "GET /api/posts/:slug", "GET /api/posts/top", "GET /api/tags"]
  },
  {
    group: "Admin CMS API",
    apis: ["POST /admin/posts", "PUT /admin/posts/:id", "POST /admin/posts/:id/publish", "PUT /admin/top-posts"]
  },
  {
    group: "Search API",
    apis: ["GET /api/search", "GET /api/archive", "GET /api/recommendations"]
  },
  {
    group: "Interaction API",
    apis: ["POST /api/comments", "POST /api/messages", "POST /api/subscribe", "POST /api/events"]
  }
];

export const backendRoadmap = [
  { phase: "MVP", zh: "文章 CRUD、标签分类、Top5 精选、公开文章列表和详情。", en: "Post CRUD, tags/categories, curated Top 5, public list and detail pages." },
  { phase: "V1", zh: "全文搜索、最近阅读、订阅、留言、访问统计和后台登录。", en: "Full-text search, recent reading, subscription, messages, analytics and admin login." },
  { phase: "V2", zh: "MDX、版本历史、推荐排序、阅读完成率、RSS、Webhook 通知。", en: "MDX, revision history, recommendation ranking, completion rate, RSS and webhooks." },
  { phase: "V3", zh: "Agent 辅助写作、自动摘要、引用检查、文章质量评分和知识库联动。", en: "Agent-assisted writing, auto summaries, citation checks, quality scoring and knowledge-base integration." }
];
