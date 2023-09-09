export interface ApiList<T> {
    docs: Array<T>;
    limit: number;
    page: number;
    pages: number;
    total: number;
  }

export interface KnowledgeBaseArticle {
    fault: string
    reason: string
    solution: string
    id: string
    series?: string
}

export interface  SearchResponse {
    text: string,
    documents: KnowledgeBaseArticle[]
}