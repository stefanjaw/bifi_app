import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { viewMode } from '../../interfaces/task-view';
import { CrudTasks } from '../../services/crud-tasks';
import { TasksListView } from '../tasks-list-view/tasks-list-view';
import { TasksGanttView } from '../tasks-gantt-view/tasks-gantt-view';
import { task } from '../../interfaces/task';
import { ganttDependency, ganttTask } from '../../interfaces/task-gantt';
import dayjs from 'dayjs';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTasksFormDialog } from '../create-tasks-form-dialog/create-tasks-form-dialog';
import { UpdateTasksFormDialog } from '../update-tasks-form-dialog/update-tasks-form-dialog';

@Component({
  selector: 'bifi-app-tasks-main-view',
  imports: [
    ButtonModule,
    TasksListView,
    TasksGanttView,
    CreateTasksFormDialog,
    UpdateTasksFormDialog,
  ],
  templateUrl: './tasks-main-view.html',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksMainView {
  private crudTasks = inject(CrudTasks);
  private tasksMaintenanceContext = inject(TasksMaintenanceContext);
  private destroy$ = inject(DestroyRef);

  // data
  private tasksResource = this.crudTasks.get({});

  // states
  viewMode = signal<viewMode>('Day');
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  // tasks
  flat = this.tasksResource.value;
  tree = signal<ganttTask[]>([]);
  visible = signal<ganttTask[]>([]);
  map = signal<Map<string, ganttTask>>(new Map());
  dependencies = signal<ganttDependency[]>([]);

  // dialogs
  createTasksFormDialog = viewChild<CreateTasksFormDialog>('createTasksFormDialog');
  updateTasksFormDialog = viewChild<UpdateTasksFormDialog>('updateTasksFormDialog');

  /**
   * Constructor for the TasksMainView component.
   *
   * Sets up the component's state by listening for changes to the tasksResource,
   * the tree, and the taskCreatedOrUpdated, toggleExpand, openCreateSubTaskDialog,
   * and openUpdateTaskDialog events.
   */
  constructor() {
    // Listen for changes to the tasksResource
    effect(() => {
      const flat = this.flat();
      if (!flat || flat.length === 0) return;

      this.tree.set(this.buildTree(flat));
      this.dependencies.set(this.buildDependencies(flat));
    });

    // Listen for changes to the tree
    effect(() => {
      const tree = this.tree();
      this.visible.set(this.flattenVisible(tree));
    });

    // Listen for changes to the taskCreatedOrUpdated event
    this.tasksMaintenanceContext.taskCreatedOrUpdated$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.tasksResource.reload());

    // Listen for changes to the toggleExpand event
    this.tasksMaintenanceContext.toggleExpand$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(id => this.toggleExpand(id));

    // Listen for changes to the openCreateSubTaskDialog event
    this.tasksMaintenanceContext.openCreateSubTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.createTasksFormDialog()?.openDialog());

    // Listen for changes to the openUpdateTaskDialog event
    this.tasksMaintenanceContext.openUpdateTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.updateTasksFormDialog()?.openDialog());
  }

  /**
   * Build a tree of tasks from a flat list of tasks
   *
   * @param flat A flat list of tasks
   * @returns A tree of tasks
   */
  private buildTree(flat: task[]): ganttTask[] {
    const mapped = flat.map<ganttTask>(t => ({
      id: t._id,
      name: t.name,
      start: t.plannedStartDate || dayjs().toISOString(),
      end: t.plannedEndDate || dayjs().add(1, 'day').toISOString(),
      progress: t.progress,
      parentId: t.parentId?._id || null,
      level: 0,
      children: [],
      isExpanded: false,
    }));

    this.map.set(this.buildMap(mapped));
    const roots: ganttTask[] = [];

    for (const t of mapped) {
      if (t.parentId) {
        const parent = this.map().get(t.parentId);
        if (parent) {
          t.level = parent.level + 1;
          parent.children.push(t);
        }
      } else {
        roots.push(t);
      }
    }

    return roots;
  }

  /**
   * Build an array of dependencies from a flat list of tasks.
   * Each dependency represents a Finish → Start relationship.
   *
   * `from`: task that must finish first
   * `to`: task that depends on it
   * @param tasks A flat list of tasks
   * @returns An array of dependencies
   */
  private buildDependencies(tasks: task[]): ganttDependency[] {
    const ids = new Set(tasks.map(t => t._id));
    const deps: ganttDependency[] = [];

    for (const t of tasks) {
      if (!t.dependencyIds?.length) continue;

      for (const dep of t.dependencyIds) {
        if (!ids.has(dep._id)) continue;

        deps.push({
          from: dep._id,
          to: t._id,
        });
      }
    }

    return deps;
  }

  /**
   * Builds a map of tasks from a flat list of tasks.
   * The map has task IDs as keys and the corresponding tasks as values.
   * @param flat A flat list of tasks
   * @returns A map of tasks
   */
  private buildMap(flat: ganttTask[]) {
    return new Map(flat.map(t => [t.id, t]));
  }

  /**
   * Flatten the visible gantt tasks from the tree.
   * A visible task is one that is currently expanded.
   * The resulting array will contain all the visible tasks
   * in the order they appear in the flattened tree.
   * @param tree The gantt task tree to flatten.
   * @returns An array of visible gantt tasks.
   */
  private flattenVisible(tree: ganttTask[]): ganttTask[] {
    const result: ganttTask[] = [];

    const walk = (nodes: ganttTask[]) => {
      for (const n of nodes) {
        result.push(n);

        if (n.isExpanded && n.children.length > 0) {
          walk(n.children);
        }
      }
    };

    walk(tree);
    return result;
  }

  /**
   * Finds a gantt task in the tree by its ID.
   *
   * @param tree The gantt task tree to search.
   * @param id The ID of the task to find.
   * @returns The gantt task if found, or null if not found.
   */
  private findNode(tree: ganttTask[], id: string): ganttTask | null {
    const stack = [...tree];

    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === id) return n;
      stack.push(...n.children);
    }
    return null;
  }

  /**
   * Toggle the expanded state of a task by its ID.
   * @param id The ID of the task to toggle.
   */
  toggleExpand(id: string) {
    const tree = this.tree();
    const node = this.findNode(tree, id);

    if (!node) return;

    node.isExpanded = !node.isExpanded;

    // Recalcular visibles:
    this.visible.set(this.flattenVisible(tree));
  }
}
