export interface Article {
  id: string;
  title: string;
  coverImage: string;
  summary: string;
  content: string;
  publishDate: string;
  tags: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFormData {
  title: string;
  coverImage?: string;
  summary?: string;
  content: string;
  publishDate?: string;
  tags?: string[];
  isDraft?: boolean;
}
