import { request } from '../utils/request';

export interface ActivityItem {
  id: string;
  title: string;
  type: 'blog' | 'snippet';
  createdAt: string;
}

export interface DashboardStats {
  blogsCount: number;
  snippetsCount: number;
  categoriesCount: number;
  tagsCount: number;
  newBlogsCount?: number;
  newSnippetsCount?: number;
  latestActivity: ActivityItem[];
}

export const getDashboardStats = () => {
  return request.get<DashboardStats>('/v1/backstage/dashboard/stats');
};
