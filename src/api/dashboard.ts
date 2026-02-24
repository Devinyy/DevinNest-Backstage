import { request } from '../utils/request';

export interface ActivityItem {
  id: string;
  title: string;
  type: 'blog' | 'snippet';
  createdAt: string;
  cover?: string;
  category?: { id: string; name: string; color?: string };
  tags?: { id: string; name: string; color?: string }[];
}

export interface DashboardStats {
  blogsCount: number;
  snippetsCount: number;
  categoriesCount: number;
  tagsCount: number;
  blogsNewThisMonth?: number;
  snippetsNewThisMonth?: number;
  latestActivity: ActivityItem[];
}

export const getDashboardStats = () => {
  return request.get<DashboardStats>('/v1/backstage/dashboard/stats');
};
