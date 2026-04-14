import {
  afterNextRender,
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
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { CrudTasks } from '../../services/crud-tasks';
import { TasksListView } from '../tasks-list-view/tasks-list-view';
import { task } from '../../interfaces/task';
import { ganttTask } from '../../interfaces/task-gantt';
import dayjs from 'dayjs';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTasksFormDialog } from '../create-tasks-form-dialog/create-tasks-form-dialog';
import { UpdateTasksFormDialog } from '../update-tasks-form-dialog/update-tasks-form-dialog';
import {
  buildGanttTree,
  collapseAllNodes,
  expandAllNodes,
  FilterBar,
  FilterManager,
  flattenVisible,
  GanttDependency,
  GanttNode,
  GanttView,
  injectResourceManager,
  ListStateManager,
  provideResourceManager,
  SearchBar,
  TimelineItem,
  TimelineView,
} from '@avalantec/base-app/resource';
import { taskFilterFields, taskFilters } from '../../libraries/task-filters';

const TASKS_VIEW_QUERY_KEY = '_view';

@Component({
  selector: 'bifi-app-tasks-main-view',
  providers: [
    FilterManager,
    ListStateManager,
    ...provideResourceManager(CrudTasks, { mode: 'all' }),
  ],
  imports: [
    ButtonModule,
    PopoverModule,
    TasksListView,
    GanttView,
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
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private destroy$ = inject(DestroyRef);

  // ResourceManager (fetch-all mode) owns: filter→searchParams, active/inactive
  // logic, URL sync for list state, and localStorage save/restore.
  private rm = injectResourceManager<task>();

  // Guard so the _view URL sync effect does not overwrite the restored URL
  // on the initial render.
  private _viewRestored = signal(false);

  // states
  viewState = signal<'gantt' | 'list' | 'timeline'>('gantt');
  isListView = computed(() => this.viewState() === 'list');

  // data / loading / error — all owned by ResourceManager
  flat = computed(() => (this.rm.allData.value() ?? []) as task[]);
  isLoading = this.rm.allData.isLoading;
  error = this.rm.allData.error;

  // exposed filter list for the search bar and filter bar
  taskFilters = taskFilters;
  taskFilterFields = taskFilterFields;

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

  // Maps raw task[] → ganttTask[] (GanttItem extension with domain-specific fields)
  private ganttItems = computed<ganttTask[]>(() => this.flat().map(t => this.mapToGanttTask(t)));

  // ganttDependencies derived from the raw task list
  ganttDependencies = computed<GanttDependency[]>(() => {
    const tasks = this.flat();
    const ids = new Set(tasks.map(t => t._id));
    const deps: GanttDependency[] = [];
    for (const t of tasks) {
      if (!t.dependencyIds?.length) continue;
      for (const dep of t.dependencyIds) {
        if (!ids.has(dep._id)) continue;
        deps.push({ from: dep._id, to: t._id });
      }
    }
    return deps;
  });

  // Tree and map as WritableSignals so expand/collapse can mutate them
  // without triggering a full tree rebuild.
  ganttTree = signal<GanttNode<ganttTask>[]>([]);
  ganttMap = signal<Map<string, GanttNode<ganttTask>>>(new Map());

  // Visible rows: recomputed whenever ganttTree reference changes
  ganttFlat = computed<GanttNode<ganttTask>[]>(() => flattenVisible(this.ganttTree()));

  // True if at least one root node is expanded (drives the header toggle button icon)
  ganttAnyExpanded = computed(() => this.ganttTree().some(n => n.isExpanded));

  // filter bar reference for chip data
  filterBarRef = viewChild(FilterBar);
  activeChips = computed(() => this.filterBarRef()?.activeChips() ?? []);

  // dialogs
  createTasksFormDialog = viewChild<CreateTasksFormDialog>('createTasksFormDialog');
  updateTasksFormDialog = viewChild<UpdateTasksFormDialog>('updateTasksFormDialog');

  constructor() {
    // Restore only the _view param — ResourceManager restores list state.
    this._restoreViewState();

    // After the first render, allow the _view URL sync effect to write.
    afterNextRender(() => {
      this._viewRestored.set(true);
    });

    // Sync _view to the URL independently of ResourceManager's list-state sync.
    effect(() => {
      if (!this._viewRestored()) return;
      const view = this.viewState();
      untracked(() => {
        const win = this.document?.defaultView;
        if (!win) return;
        const existing = new URLSearchParams(win.location.search);
        existing.set(TASKS_VIEW_QUERY_KEY, view);
        win.history.replaceState(
          win.history.state,
          '',
          win.location.pathname + '?' + existing.toString()
        );
      });
    });

    // Rebuild tree whenever ganttItems() changes; carry expand state from prevMap
    effect(() => {
      const items = this.ganttItems();
      const prevMap = untracked(() => this.ganttMap());
      const { tree, map } = buildGanttTree(
        items,
        { idField: 'id', parentField: 'parentId' },
        prevMap
      );
      this.ganttTree.set(tree);
      this.ganttMap.set(map);
    });

    // Listen for task created/updated to reload data
    this.tasksMaintenanceContext.taskCreatedOrUpdated$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.rm.allData.reload());

    // List view expand/collapse
    this.tasksMaintenanceContext.toggleExpand$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(id => this.toggleExpand(id));

    this.tasksMaintenanceContext.expandAll$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        const tree = this.ganttTree();
        expandAllNodes(tree);
        this.ganttTree.set([...tree]);
      });

    this.tasksMaintenanceContext.collapseAll$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        const tree = this.ganttTree();
        collapseAllNodes(tree);
        this.ganttTree.set([...tree]);
      });

    // Dialog management
    this.tasksMaintenanceContext.openCreateSubTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.createTasksFormDialog()?.openDialog());

    this.tasksMaintenanceContext.openUpdateTaskDialog$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.updateTasksFormDialog()?.openDialog());

    this.tasksMaintenanceContext.deleteTask$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(id => this.deleteTask(id));
  }

  // Restores only the view mode (gantt/list/timeline) from the URL.
  // ResourceManager handles all other list state (filters, search, page).
  private _restoreViewState(): void {
    const params = this.route.snapshot.queryParams as Record<string, string>;
    const view = params[TASKS_VIEW_QUERY_KEY] as 'gantt' | 'list' | 'timeline';
    if (view && ['gantt', 'list', 'timeline'].includes(view)) this.viewState.set(view);
  }

  // Maps a raw task to a ganttTask (GanttItem extension)
  private mapToGanttTask(t: task): ganttTask {
    return {
      id: t._id,
      name: t.name,
      start: t.plannedStartDate || dayjs().toISOString(),
      end: t.plannedEndDate || dayjs().add(1, 'day').toISOString(),
      progress: t.progress,
      parentId: t.parentId?._id || null,
      stage: t.stage,
      priority: t.priority,
      projectName: t.projectId?.name,
    };
  }

  // Expand / collapse

  toggleExpand(id: string): void {
    const node = this.ganttMap().get(id);
    if (!node) return;
    node.isExpanded = !node.isExpanded;
    this.ganttTree.set([...this.ganttTree()]);
  }

  toggleExpandAll(): void {
    const tree = this.ganttTree();
    const anyExpanded = tree.some(n => n.isExpanded);
    if (anyExpanded) {
      collapseAllNodes(tree);
    } else {
      expandAllNodes(tree);
    }
    this.ganttTree.set([...tree]);
  }

  // GanttView output handlers

  onGanttCardDateChange(event: { id: string; start: dayjs.Dayjs; end: dayjs.Dayjs }): void {
    this.crudTasks
      .put({
        _id: event.id,
        data: {
          plannedStartDate: event.start.toISOString(),
          plannedEndDate: event.end.toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: result => {
          if (result) this.tasksMaintenanceContext.taskCreatedOrUpdated();
        },
      });
  }

  onGanttItemClick(id: string): void {
    this.tasksMaintenanceContext.openUpdateTaskDialog(id);
  }

  onGanttAddSubitem(id: string): void {
    this.tasksMaintenanceContext.openCreateSubTaskDialog(id);
  }

  onGanttDeleteItem(id: string): void {
    this.deleteTask(id);
  }

  removeFilterChip(id: string): void {
    this.filterBarRef()?.removeRow(id);
  }

  deleteTask(id: string): void {
    this.crudTasks
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.rm.allData.reload();
        },
      });
  }
}
