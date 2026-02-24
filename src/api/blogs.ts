import { request } from '../utils/request';
export { uploadFile } from './common';

export interface BlogCategory {
  id: string;
  name: string;
  color?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  color?: string;
}

export interface Blog {
  id: string;
  title: string;
  subtitle: string;
  cover?: string;
  categoryId: string;
  tagIds: string[];
  status: string; // 'draft' | 'published' | 'archived'
  content: string;
  views: number;
  createdAt: string;
  category?: BlogCategory;
  tags?: BlogTag[];
}

export interface CreateBlogParams {
  title: string;
  subtitle: string;
  cover?: string;
  categoryId: string;
  tagIds: string[];
  status: string;
  content: string;
}

export interface UpdateBlogParams extends Partial<CreateBlogParams> {
  id: string;
}

export interface BlogQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  categoryId?: string;
}

export interface BlogListResult {
  list: Blog[];
  total: number;
}

export const getBlogs = (params?: BlogQueryParams) => {
  return request.get<BlogListResult>('/v1/backstage/blogs', params);
};

export const createBlog = (data: CreateBlogParams) => {
  return request.post<Blog>('/v1/backstage/blogs/create', data);
};

export const getBlogDetail = (id: string) => {
  return request.get<Blog>(`/v1/backstage/blogs/${id}`);
};

export const updateBlog = (data: UpdateBlogParams) => {
  return request.post<Blog>('/v1/backstage/blogs/update', data);
};

export const deleteBlog = (id: string) => {
  return request.post<void>('/v1/backstage/blogs/delete', { id });
};

