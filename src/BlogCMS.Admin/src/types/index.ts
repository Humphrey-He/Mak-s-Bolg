export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  tag: string;
  readTimeMinutes: number;
  isTop: boolean;
  isFeatured: boolean;
  status: ArticleStatus;
  filePath: string;
  lastCommitSha: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  tag: string;
  readTimeMinutes: number;
  isTop: boolean;
  isFeatured: boolean;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum ArticleStatus {
  Draft = 0,
  Published = 1,
  Archived = 2
}

export interface CreateArticleRequest {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  tag?: string;
  coverImageUrl?: string;
  isTop: boolean;
  isFeatured: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  description?: string;
  content?: string;
  tag?: string;
  coverImageUrl?: string;
  isTop?: boolean;
  isFeatured?: boolean;
}

export interface PublishJob {
  id: number;
  articleId: number;
  status: string;
  errorMessage: string | null;
  commitSha: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  retryCount: number;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

export interface CreateTagRequest {
  name: string;
  slug: string;
}

export interface UpdateTagRequest {
  name?: string;
  slug?: string;
}

// Media types
export interface MediaItem {
  id: number;
  fileName: string;
  originalName: string;
  url: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}
