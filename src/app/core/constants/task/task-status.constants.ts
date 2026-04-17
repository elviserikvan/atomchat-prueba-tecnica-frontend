import { TaskStatus } from '../../enums/task/task-status.enum';

export interface TaskStatusOption<TValue> {
  value: TValue;
  label: string;
}

export const TASK_STATUS_LABELS: Readonly<Record<TaskStatus, string>> = {
  [TaskStatus.CREATED]: 'Creada',
  [TaskStatus.PENDING]: 'Pendiente',
  [TaskStatus.IN_PROGRESS]: 'En proceso',
  [TaskStatus.COMPLETED]: 'Completada',
};

export const TASK_STATUS_OPTIONS: ReadonlyArray<TaskStatusOption<TaskStatus>> =
  Object.freeze([
    { value: TaskStatus.CREATED, label: TASK_STATUS_LABELS[TaskStatus.CREATED] },
    { value: TaskStatus.PENDING, label: TASK_STATUS_LABELS[TaskStatus.PENDING] },
    {
      value: TaskStatus.IN_PROGRESS,
      label: TASK_STATUS_LABELS[TaskStatus.IN_PROGRESS],
    },
    {
      value: TaskStatus.COMPLETED,
      label: TASK_STATUS_LABELS[TaskStatus.COMPLETED],
    },
  ]);

export const TASK_STATUS_FILTER_OPTIONS: ReadonlyArray<
  TaskStatusOption<TaskStatus | null>
> = Object.freeze([
  { value: null, label: 'Todos' },
  ...TASK_STATUS_OPTIONS,
]);
