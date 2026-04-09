import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
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
import {
  FilterBar,
  FilterManager,
  SearchBar,
  TimelineItem,
  TimelineView,
} from '@avalantec/base-app/resource';
import { taskFilterFields, taskFilters } from '../../libraries/task-filters';

@Component({
  selector: 'bifi-app-tasks-main-view',
  providers: [FilterManager],
  imports: [
    ButtonModule,
    PopoverModule,
    TasksListView,
    TasksGanttView,
    CreateTasksFormDialog,
    UpdateTasksFormDialog,
    SearchBar,
    FilterBar,
    TimelineView,
  ],
  templateUrl: './tasks-main-view.html',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksMainView {
  private crudTasks = inject(CrudTasks);
  private tasksMaintenanceContext = inject(TasksMaintenanceContext);
  private filterManager = inject(FilterManager);
  private destroy$ = inject(DestroyRef);
  private getInactive = signal<boolean | null>(false);

  // filter params derived from the FilterManager
  private filterParams = computed(() => {
    const filters = this.filterManager.filters();
    return filters.length > 0 ? this.filterManager.getFilterObject() : {};
  });

  // data (reacts to search filter changes automatically)
  private tasksResource = this.crudTasks.get({
    searchParams: this.filterParams,
    getInactive: this.getInactive,
  });

  // states
  viewMode = signal<viewMode>('Day');
  viewState = signal<'gantt' | 'list' | 'timeline'>('gantt');
  isListView = computed(() => this.viewState() === 'list');
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  // exposed filter list for the search bar and filter bar
  taskFilters = taskFilters;
  taskFilterFields = taskFilterFields;

  // tasks
  flat = this.tasksResource.value;

  // milestone timeline items
  milestoneItems = computed<TimelineItem[]>(() =>
    this.flat()
      .filter(t => t.isMilestone === true)
      .sort((a, b) => {
        const aTs = a.plannedStartDate ? new Date(a.plannedStartDate).getTime() : 0;
        const bTs = b.plannedStartDate ? new Date(b.plannedStartDate).getTime() : 0;
        return aTs - bTs;
      })
      .map(t => ({
        label: t.name,
        date: t.plannedStartDate ?? new Date().toISOString(),
        type: 'milestone' as const,
        action: () => {
          this.tasksMaintenanceContext.openUpdateTaskDialog(t._id);
          this.updateTasksFormDialog()?.openDialog();
        },
      }))
  );

  tree = signal<ganttTask[]>([]);
  visible = signal<ganttTask[]>([]);
  map = signal<Map<string, ganttTask>>(new Map());
  dependencies = signal<ganttDependency[]>([]);

  // filter bar reference for chip data
  filterBarRef = viewChild(FilterBar);
  activeChips = computed(() => this.filterBarRef()?.activeChips() ?? []);

  // dialogs
  createTasksFormDialog = viewChild<CreateTasksFormDialog>('createTasksFormDialog');
  updateTasksFormDialog = viewChild<UpdateTasksFormDialog>('updateTasksFormDialog');

  constructor() {
    effect(() => {
      const filters = this.filterManager.filters();

      if (filters.length > 0) {
        const filterObject = this.filterManager.getFilterObject();

        // If the filter object contains the 'active' property, we set getInactive to null to include both active and inactive records in the results.
        if (this.filterManager.hasActivePropertyUtil(filterObject)) this.getInactive.set(null);
        else this.getInactive.set(false);
      } else {
        this.getInactive.set(false);
      }
    });

    // Listen for changes to the tasksResource
    effect(() => {
      const flat = this.flat();
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

    // Listen for the expandAll event
    this.tasksMaintenanceContext.expandAll$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.expandAll());

    // Listen for the collapseAll event
    this.tasksMaintenanceContext.collapseAll$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.collapseAll());

    // Listen for changes to the openCreateSubTaskDialog event
    this.tasksMaintenanceContext.openCreateSubTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.createTasksFormDialog()?.openDialog());

    // Listen for changes to the openUpdateTaskDialog event
    this.tasksMaintenanceContext.openUpdateTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.updateTasksFormDialog()?.openDialog());

    // Listen for changes to the deleteTask event
    this.tasksMaintenanceContext.deleteTask$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(id => this.deleteTask(id));
  }

  private buildTree(flat: task[]): ganttTask[] {
    const previousTasks = untracked(this.tree);

    const nodes = flat.map<ganttTask>(t => ({
      id: t._id,
      name: t.name,
      start: t.plannedStartDate || dayjs().toISOString(),
      end: t.plannedEndDate || dayjs().add(1, 'day').toISOString(),
      progress: t.progress,
      parentId: t.parentId?._id || null,
      level: 0,
      children: [],
      isExpanded: this.findNode(previousTasks, t._id)?.isExpanded || false,
      stage: t.stage,
      priority: t.priority,
      projectName: t.projectId?.name,
    }));

    const map = new Map(nodes.map(n => [n.id, n]));
    this.map.set(map);

    const roots: ganttTask[] = [];

    for (const n of nodes) {
      if (n.parentId) {
        const parent = map.get(n.parentId);

        if (parent) {
          parent.children.push(n);
        } else {
          roots.push(n);
        }
      } else {
        roots.push(n);
      }
    }

    this.assignLevels(roots);

    return roots;
  }

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

  private findNode(tree: ganttTask[], id: string): ganttTask | null {
    const stack = [...tree];

    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === id) return n;
      stack.push(...n.children);
    }
    return null;
  }

  private assignLevels(nodes: ganttTask[], level = 0) {
    for (const n of nodes) {
      n.level = level;
      if (n.children.length) {
        this.assignLevels(n.children, level + 1);
      }
    }
  }

  private setExpandedAll(nodes: ganttTask[], value: boolean) {
    for (const n of nodes) {
      if (n.children.length > 0 || value === false) {
        n.isExpanded = value;
      }
      if (n.children.length > 0) {
        this.setExpandedAll(n.children, value);
      }
    }
  }

  toggleExpand(id: string) {
    const tree = this.tree();
    const node = this.findNode(tree, id);

    if (!node) return;

    node.isExpanded = !node.isExpanded;
    this.visible.set(this.flattenVisible(tree));
  }

  expandAll() {
    const tree = this.tree();
    this.setExpandedAll(tree, true);
    this.visible.set(this.flattenVisible(tree));
  }

  collapseAll() {
    const tree = this.tree();
    this.setExpandedAll(tree, false);
    this.visible.set(this.flattenVisible(tree));
  }

  removeFilterChip(id: string): void {
    this.filterBarRef()?.removeRow(id);
  }

  deleteTask(id: string) {
    this.crudTasks
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.tasksResource.reload();
        },
      });
  }
}
