import { request } from '../utils/request';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  count?: number;
}

export interface CreateCategoryParams {
  name: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

export interface CreateTagParams {
  name: string;
  color?: string;
}

// Categories
export const getCategories = () => {
  return request.get<Category[]>('/v1/backstage/categories');
};

export const createCategory = (data: CreateCategoryParams) => {
  return request.post<Category>('/v1/backstage/categories', data);
};

export const updateCategory = (id: string, data: CreateCategoryParams) => {
  return request.put<Category>(`/v1/backstage/categories/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return request.delete<void>(`/v1/backstage/categories/${id}`);
};

// Tags
export const getTags = () => {
  return request.get<Tag[]>('/v1/backstage/tags');
};

export const createTag = (data: CreateTagParams) => {
  return request.post<Tag>('/v1/backstage/tags', data);
};

export const updateTag = (id: string, data: CreateTagParams) => {
  return request.put<Tag>(`/v1/backstage/tags/${id}`, data);
};

export const deleteTag = (id: string) => {
  return request.delete<void>(`/v1/backstage/tags/${id}`);
};
