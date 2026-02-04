import { request } from '../utils/request';

export interface Snippet {
  id: string;
  content: any[]; // Block-based content
  metadata: any; // Changed from string to any to match usage (object)
  tags: string[];
}

export interface CreateSnippetParams {
  content: any[];
  metadata: any;
  tags: string[];
}

export interface UpdateSnippetParams {
  id: string;
  content: any[];
}

export interface SnippetQueryParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export const getSnippets = (params?: SnippetQueryParams) => {
  return request.get<Snippet[]>('/v1/backstage/snippets', params);
};

export const createSnippet = (data: CreateSnippetParams) => {
  return request.post<Snippet>('/v1/backstage/snippets/create', data);
};

export const getSnippetDetail = (id: string) => {
  return request.get<Snippet>(`/v1/backstage/snippets/${id}`);
};

export const updateSnippet = (data: UpdateSnippetParams) => {
  return request.post<Snippet>('/v1/backstage/snippets/update', data);
};

export const deleteSnippet = (id: string) => {
  return request.post<void>('/v1/backstage/snippets/delete', { id });
};
