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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import {
  buildGanttTree,
  CalendarEvent,
  CalendarView,
  collapseAllNodes,
  expandAllNodes,
  FilterBar,
  FilterManager,
  flattenVisible,
  GanttNode,
  GanttView,
  injectResourceManager,
  ListStateManager,
  provideResourceManager,
  resolveGanttReorder,
  SearchBar,
  TimelineItem,
  TimelineView,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProjects } from '../../services/crud-projects';
import { projectColumns } from '../../libraries/project-columns';
import { project } from '../../interfaces/projects';
import { ganttProject } from '../../interfaces/project-gantt';
import { projectFilterFields, projectFilters } from '../../libraries/project-filters';
import { ProjectsListView } from '../projects-list-view/projects-list-view';
import dayjs from 'dayjs';

const CALENDAR_COLORS: CalendarEvent['color'][] = ['blue', 'indigo', 'green', 'purple', 'pink'];
function calendarColorFromId(id: string | number): CalendarEvent['color'] {
  const s = String(id);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return CALENDAR_COLORS[h % CALENDAR_COLORS.length];
}

const PROJECTS_VIEW_QUERY_KEY = '_view';

@Component({
  selector: 'bifi-app-projects-list',
  providers: [
    FilterManager,
    ListStateManager,
    ...provideResourceManager(CrudProjects, { mode: 'all' }),
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    ButtonModule,
    TooltipModule,
    SearchBar,
    RouterLink,
    HasPermission,
    TimelineView,
    FilterBar,
    GanttView,
    ProjectsListView,
    CalendarView,
  ],
  templateUrl: './projects-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList {
  private crudProjects = inject(CrudProjects);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);

  private rm = injectResourceManager<project>();

  private _viewRestored = signal(false);

  viewState = signal<'gantt' | 'list' | 'timeline' | 'calendar'>('gantt');

  flat = computed(() => (this.rm.allData.value() ?? []) as project[]);
  isLoading = this.rm.allData.isLoading;
  error = this.rm.allData.error;

  projectColumns = projectColumns;
  projectFilters = projectFilters;
  projectFilterFields = projectFilterFields;

  filterBarRef = viewChild(FilterBar);
  activeChips = computed(() => this.filterBarRef()?.activeChips() ?? []);

  calendarEvents = computed<CalendarEvent[]>(() => {
    const today = new Date();
    return this.flat().map(p => {
      const start = p.dateStart ? dayjs(p.dateStart).toDate() : today;
      const end = p.dateEnd ? dayjs(p.dateEnd).toDate() : new Date(start.getTime() + 3600000);
      return {
        id: p._id,
        title: p.name,
        start,
        end,
        color: calendarColorFromId(p._id),
      };
    });
  });

  timelineItems = computed<TimelineItem[]>(() =>
    this.flat()
      .filter(p => p.dateEnd)
      .sort((a, b) => new Date(a.dateEnd).getTime() - new Date(b.dateEnd).getTime())
      .map(p => ({
        label: p.name,
        date: p.dateEnd,
        type: 'end' as const,
        action: () => this.router.navigate(['../edit', p._id], { relativeTo: this.route }),
      }))
  );

  private ganttItems = computed<ganttProject[]>(() =>
    this.flat().map(p => this.mapToGanttProject(p))
  );

  ganttTree = signal<GanttNode<ganttProject>[]>([]);
  ganttMap = signal<Map<string, GanttNode<ganttProject>>>(new Map());

  ganttFlat = computed<GanttNode<ganttProject>[]>(() => flattenVisible(this.ganttTree()));

  ganttAnyExpanded = computed(() => this.ganttTree().some(n => n.isExpanded));

  constructor() {
    this._restoreViewState();

    afterNextRender(() => {
      this._viewRestored.set(true);
    });

    effect(() => {
      if (!this._viewRestored()) return;
      const view = this.viewState();
      untracked(() => {
        const win = this.document?.defaultView;
        if (!win) return;
        const existing = new URLSearchParams(win.location.search);
        existing.set(PROJECTS_VIEW_QUERY_KEY, view);
        win.history.replaceState(
          win.history.state,
          '',
          win.location.pathname + '?' + existing.toString()
        );
      });
    });

    effect(() => {
      const items = this.ganttItems();
      const prevMap = untracked(() => this.ganttMap());
      const { tree, map } = buildGanttTree(
        items,
        { idField: 'id', parentField: 'parentId', sequenceField: 'sequence' },
        prevMap
      );
      this.ganttTree.set(tree);
      this.ganttMap.set(map);
    });
  }

  private _restoreViewState(): void {
    const params = this.route.snapshot.queryParams as Record<string, string>;
    const view = params[PROJECTS_VIEW_QUERY_KEY] as 'gantt' | 'list' | 'timeline' | 'calendar';
    if (view && ['gantt', 'list', 'timeline', 'calendar'].includes(view)) this.viewState.set(view);
  }

  private mapToGanttProject(p: project): ganttProject {
    return {
      id: p._id,
      name: p.name,
      start: p.dateStart ? dayjs(p.dateStart).toISOString() : dayjs().toISOString(),
      end: p.dateEnd ? dayjs(p.dateEnd).toISOString() : dayjs().add(1, 'day').toISOString(),
      progress: 0,
      parentId: p.parentId?._id ?? null,
      sequence: p.sequence ?? 1,
      stage: p.stage,
      priority: p.priority,
      contactName: p.contactId
        ? [p.contactId.name, p.contactId.lastName].filter(Boolean).join(' ')
        : undefined,
    };
  }

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

  goToEditProject(id: string): void {
    this.router.navigate(['../edit', id], { relativeTo: this.route });
  }

  onGanttAddSubitem(id: string): void {
    this.router.navigate(['../create'], {
      relativeTo: this.route,
      queryParams: { parentId: id },
    });
  }

  onGanttItemReorder(event: { id: string; targetId: string; mode: 'before' | 'after' }): void {
    const patches = resolveGanttReorder(this.ganttMap(), event);
    if (!patches) return;

    const requests = patches.map(({ id, sequence, parentId }) => {
      const data: Record<string, unknown> = { sequence };
      if (parentId != null) data['parentId'] = parentId;
      return this.crudProjects.put({ _id: id, data });
    });

    combineLatest(requests)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.rm.allData.reload() });
  }

  onGanttItemReparent(event: { id: string; parentId: string }): void {
    this.crudProjects
      .put({ _id: event.id, data: { parentId: event.parentId } })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.rm.allData.reload() });
  }

  onProjectDateChange(event: {
    id: string;
    start: dayjs.Dayjs | Date;
    end: dayjs.Dayjs | Date;
  }): void {
    this.crudProjects
      .put({
        _id: event.id,
        data: {
          dateStart: dayjs(event.start).toISOString(),
          dateEnd: dayjs(event.end).toISOString(),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: result => {
          if (result) this.rm.allData.reload();
        },
      });
  }

  viewTasks(project: project): void {
    const filters = JSON.stringify([
      { field: 'projectId.name', operator: 'like', value: project.name, type: 'string' },
    ]);
    this.router.navigate(['/tasks/view'], {
      queryParams: { _filters: filters, _view: 'list' },
    });
  }

  viewTasksById(id: string): void {
    const project = this.flat().find(p => p._id === id);
    if (project) this.viewTasks(project);
  }

  deleteProject(id: string) {
    this.crudProjects
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.rm.allData.reload();
        },
      });
  }
}
