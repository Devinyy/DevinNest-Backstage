import { request } from '../utils/request';

export interface Snippet {
  id: string;
  content: any[]; // Block-based content
  metadata: string;
  tags: string[];
}

export interface CreateSnippetParams {
  content: any[];
  metadata: string;
  tags: string[];
}

export interface UpdateSnippetParams extends Partial<CreateSnippetParams> {}

export interface SnippetQueryParams {
  page?: number;
  pageSize?: number;
}

export const getSnippets = (params?: SnippetQueryParams) => {
  return request.get<Snippet[]>('/v1/backstage/snippets', params);
};

export const createSnippet = (data: CreateSnippetParams) => {
  return request.post<Snippet>('/v1/backstage/snippets', data);
};

export const getSnippetDetail = (id: string) => {
  return request.get<Snippet>(`/v1/backstage/snippets/${id}`);
};

export const updateSnippet = (id: string, data: UpdateSnippetParams) => {
  return request.put<Snippet>(`/v1/backstage/snippets/${id}`, data);
};

export const deleteSnippet = (id: string) => {
  return request.delete<void>(`/v1/backstage/snippets/${id}`);
};
