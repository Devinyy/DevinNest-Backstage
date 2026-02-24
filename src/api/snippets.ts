import { request } from '../utils/request';

// Block Types (Copying from Create.tsx for consistency or defining shared types)
export interface BaseBlock {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'quote';
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  caption?: string;
  exif?: string;
  layout?: 'normal' | 'bleed' | 'portrait';
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  layout: 'grid-2' | 'grid-3';
  images: string[];
  caption?: string;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
}

export type SnippetBlock = TextBlock | ImageBlock | GalleryBlock | QuoteBlock;

export interface SnippetMetadata {
  date?: string;
  weather?: string;
  mood?: string;
  location?: string;
  camera?: string;
}

export interface Snippet {
  id: string;
  title: string;
  subtitle?: string;
  cover?: string;
  content: SnippetBlock[];
  metadata: SnippetMetadata;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetParams {
  title: string;
  subtitle?: string;
  cover?: string;
  content: SnippetBlock[];
  metadata: SnippetMetadata;
  tags: string[];
}

export interface UpdateSnippetParams extends CreateSnippetParams {
  id: string;
}

export interface SnippetQueryParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export interface SnippetListResult {
  list: Snippet[];
  total: number;
}

export const getSnippets = (params?: SnippetQueryParams) => {
  return request.get<SnippetListResult>('/v1/backstage/snippets', params);
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
