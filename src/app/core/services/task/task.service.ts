import { Injectable } from '@angular/core';
import { API_TASK_ROUTES } from '../../api-routes/task/task.routes';
import { RequestMethod } from '../../enums/httpRequest/requestMethods.enum';
import {
  ITask,
  ITaskCreate,
  ITaskListResponse,
  ITaskUpdate,
} from '../../interfaces/task/task.interface';
import { GlobalHttpService } from '../globalHttp/global-http.service';
import { TaskStatus } from '../../enums/task/task-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends GlobalHttpService {
  async create(payload: ITaskCreate): Promise<ITask> {
    return await this.makeRequest<ITask, ITaskCreate>(
      API_TASK_ROUTES.BASE,
      payload,
      RequestMethod.POST,
    );
  }

  async getAll(): Promise<ITask[]> {
    return (await this.getTasks()).items;
  }

  async getTasks(filters?: {
    status?: TaskStatus | null;
    page?: number;
    limit?: number;
  }): Promise<ITaskListResponse> {
    const query: Record<string, string | number> = {};

    if (filters?.status) {
      query['status'] = filters.status;
    }

    if (filters?.page) {
      query['page'] = filters.page;
    }

    if (filters?.limit) {
      query['limit'] = filters.limit;
    }

    return await this.makeHttpRequest<ITaskListResponse>(
      API_TASK_ROUTES.BASE,
      query,
      RequestMethod.GET,
    );
  }

  async update(taskId: string, data: ITaskUpdate): Promise<ITask> {
    return await this.makeRequest<ITask, ITaskUpdate>(
      `${API_TASK_ROUTES.BASE}/${taskId}`,
      data,
      RequestMethod.PATCH,
    );
  }

  async delete(id: string): Promise<void> {
    return await this.makeHttpRequest<void>(
      `${API_TASK_ROUTES.BASE}/${id}`,
      {},
      RequestMethod.DELETE,
    );
  }
}
