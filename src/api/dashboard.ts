import { request } from '../utils/request';

export interface DashboardStats {
  blogsCount: number;
  snippetsCount: number;
  categoriesCount: number;
  tagsCount: number;
  newBlogsCount?: number;
  newSnippetsCount?: number;
  latestActivity: any;
}

export const getDashboardStats = () => {
  return request.get<DashboardStats>('/v1/backstage/dashboard/stats');
};
