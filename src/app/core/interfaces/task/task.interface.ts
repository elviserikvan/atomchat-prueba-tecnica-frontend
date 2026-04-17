import { TaskStatus } from '../../enums/task/task-status.enum';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ITaskCreate {
  title: string;
  description: string;
  status?: TaskStatus;
}

export type ITaskUpdate = Partial<ITaskCreate>;

export interface ITaskListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  status: TaskStatus | null;
}

export interface ITaskListResponse {
  items: ITask[];
  meta: ITaskListMeta;
}
