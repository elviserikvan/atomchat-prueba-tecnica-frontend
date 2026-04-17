import {
  TASK_STATUS_FILTER_OPTIONS,
  TASK_STATUS_LABELS,
  TASK_STATUS_OPTIONS,
} from '@/app/core/constants/task/task-status.constants';
import { TaskStatus } from '@/app/core/enums/task/task-status.enum';
import {
  ITask,
  ITaskListMeta,
} from '@/app/core/interfaces/task/task.interface';
import { FirebaseAuthService } from '@/app/core/services/firebase-auth/firebase-auth.service';
import { SessionService } from '@/app/core/services/session/session.service';
import { TaskService } from '@/app/core/services/task/task.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrl: './task-home.component.scss',
})
export class TaskHomeComponent implements OnInit {
  readonly taskStatus = TaskStatus;
  readonly taskStatusOptions = TASK_STATUS_OPTIONS;
  readonly taskStatusFilterOptions = TASK_STATUS_FILTER_OPTIONS;
  readonly taskStatusLabels = TASK_STATUS_LABELS;
  tasks: ITask[] = [];
  paginationMeta: ITaskListMeta = {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    status: null,
  };
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  userEmail = '';
  editingTaskId: string | null = null;
  selectedStatusFilter: TaskStatus | null = null;

  readonly taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(400)]],
  });

  readonly editForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(400)]],
    status: [TaskStatus.PENDING, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly taskService: TaskService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const hasValidSession = await this.sessionService.hasValidSession();

    if (!hasValidSession) {
      await this.router.navigate(['/']);
      return;
    }

    const userEmail = await this.sessionService.getUserEmail();

    if (!userEmail) {
      await this.router.navigate(['/']);
      return;
    }

    this.userEmail = userEmail;
    await this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.taskService.getTasks({
        status: this.selectedStatusFilter,
        page: this.paginationMeta.page,
        limit: this.paginationMeta.limit,
      });
      this.tasks = response.items;
      this.paginationMeta = response.meta;
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible cargar las tareas.';
    } finally {
      this.isLoading = false;
    }
  }

  async createTask(): Promise<void> {
    if (this.taskForm.invalid || this.isSaving) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    try {
      await this.taskService.create({
        title: this.taskForm.getRawValue().title!.trim(),
        description: this.taskForm.getRawValue().description!.trim(),
      });

      this.taskForm.reset({
        title: '',
        description: '',
      });
      this.paginationMeta.page = 1;
      await this.loadTasks();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible crear la tarea.';
    } finally {
      this.isSaving = false;
    }
  }

  startEdit(task: ITask): void {
    this.editingTaskId = task.id;
    this.editForm.setValue({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editForm.reset();
  }

  async saveEdit(task: ITask): Promise<void> {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    try {
      await this.taskService.update(task.id, {
        title: this.editForm.getRawValue().title!.trim(),
        description: this.editForm.getRawValue().description!.trim(),
        status: this.editForm.getRawValue().status!,
      });

      this.cancelEdit();
      await this.loadTasks();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible actualizar la tarea.';
    }
  }

  async deleteTask(task: ITask): Promise<void> {
    const shouldDelete = window.confirm(`¿Deseas eliminar "${task.title}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await this.taskService.delete(task.id);
      await this.loadTasks();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible eliminar la tarea.';
    }
  }

  async logout(): Promise<void> {
    await this.firebaseAuthService.logout();
    await this.sessionService.clear();
    await this.router.navigate(['/']);
  }

  trackByTaskId(_: number, task: ITask): string {
    return task.id;
  }

  async changeTaskStatus(task: ITask, status: TaskStatus): Promise<void> {
    const previousValue = task.status;
    task.status = status;

    try {
      await this.taskService.update(task.id, { status });
      await this.loadTasks();
    } catch (error) {
      console.error(error);
      task.status = previousValue;
      this.errorMessage = 'No fue posible cambiar el estado de la tarea.';
    }
  }

  async onStatusFilterChange(status: TaskStatus | null): Promise<void> {
    this.selectedStatusFilter = status;
    this.paginationMeta.page = 1;
    await this.loadTasks();
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.paginationMeta.totalPages) {
      return;
    }

    this.paginationMeta.page = page;
    await this.loadTasks();
  }

  getStatusLabel(status: TaskStatus): string {
    return this.taskStatusLabels[status];
  }
}
