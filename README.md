# 书鸿 · Juno Mak Blog

这是从 Canvas 单文件原型拆分出来的 Next.js App Router 版本骨架。

## 启动

```bash
npm install
npm run dev
```

## 目录说明

```txt
app/                 App Router 页面
components/layout/   全局布局组件
components/home/     首页组件
components/blog/     文章流与检索分页
components/backend/  后端先行设计栏目
components/agent/    Agent 项目页
components/shared/   基础 UI 组件
data/                静态数据与多语言文案
lib/                 工具函数
styles/              全局样式
```

## 下一步建议

1. 把 `data/posts.ts` 替换为后端 API。
2. 新增 `/admin` 后台管理 Top5、文章、最近阅读。
3. 将 `copy.ts` 升级为真正的 i18n provider。
4. 将文章详情页扩展为 `/blog/[slug]`。
5. 接入 Go 后端或 Next.js Route Handler。
