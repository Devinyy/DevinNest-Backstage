import { request } from '../utils/request';

export interface Project {
  id: string | number;
  name: string;
  description: string;
  owner: string;
}

export interface CreateProjectParams {
  name: string;
  description: string;
  owner: string;
}

export interface ProjectQueryParams {
  skip?: number;
  limit?: number;
}

export const getProjects = (params?: ProjectQueryParams) => {
  return request.get<Project[]>('/v1/nest/projects/', params);
};

export const createProject = (data: CreateProjectParams) => {
  return request.post<Project>('/v1/nest/projects/', data);
};
