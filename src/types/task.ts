export interface Task {
  id: number;
  name: string;
  search: string;
  status: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
}

export enum TaskStatus {
  DRAFT = 'DRAFT',
  STARTED = 'STARTED',
  INWORK = 'INWORK',
  ONPAUSE = 'ONPAUSE',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface CreateTaskRequest {
  name: string;
  status?: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: string; // Changed to string to handle bigint properly
}

export interface UpdateTaskRequest {
  name: string;
  status?: TaskStatus;
  description?: string;
  comment?: string;
  projectId?: string; // Changed to string to handle bigint properly
}

export interface TaskQueryParams {
  id?: number;
  email?: string;
  status?: string;
  name?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
