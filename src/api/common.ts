import { request } from '../utils/request';

export interface UploadResult {
  url: string;
  filename: string;
}

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post<UploadResult>('/v1/backstage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
