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
  return request.post<Category>('/v1/backstage/categories/create', data);
};

export const updateCategory = (data: CreateCategoryParams & { id: string }) => {
  return request.post<Category>('/v1/backstage/categories/update', data);
};

export const deleteCategory = (id: string) => {
  return request.post<void>('/v1/backstage/categories/delete', { id });
};

// Tags
export const getTags = () => {
  return request.get<Tag[]>('/v1/backstage/tags');
};

export const createTag = (data: CreateTagParams) => {
  return request.post<Tag>('/v1/backstage/tags/create', data);
};

export const updateTag = (data: CreateTagParams & { id: string }) => {
  return request.post<Tag>('/v1/backstage/tags/update', data);
};

export const deleteTag = (id: string) => {
  return request.post<void>('/v1/backstage/tags/delete', { id });
};
