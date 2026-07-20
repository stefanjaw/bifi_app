import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksMaintenanceContext {
  private _taskCreatedOrUpdated = new Subject<void>();
  private _toggleExpand = new Subject<string>();
  private _openUpdateTaskDialog = new Subject<string>();
  private _openCreateSubTaskDialog = new Subject<{ parentId: string; projectId?: string }>();
  private _deleteTask = new Subject<string>();
  private _expandAll = new Subject<void>();
  private _collapseAll = new Subject<void>();

  taskCreatedOrUpdated$ = this._taskCreatedOrUpdated.asObservable();
  toggleExpand$ = this._toggleExpand.asObservable();
  openUpdateTaskDialog$ = this._openUpdateTaskDialog.asObservable();
  openCreateSubTaskDialog$ = this._openCreateSubTaskDialog.asObservable();
  deleteTask$ = this._deleteTask.asObservable();
  expandAll$ = this._expandAll.asObservable();
  collapseAll$ = this._collapseAll.asObservable();

  deleteTask(id: string) {
    this._deleteTask.next(id);
  }

  openCreateSubTaskDialog(payload: { parentId: string; projectId?: string }) {
    this._openCreateSubTaskDialog.next(payload);
  }

  openUpdateTaskDialog(id: string) {
    this._openUpdateTaskDialog.next(id);
  }

  toggleExpand(id: string) {
    this._toggleExpand.next(id);
  }

  taskCreatedOrUpdated() {
    this._taskCreatedOrUpdated.next();
  }

  expandAll() {
    this._expandAll.next();
  }

  collapseAll() {
    this._collapseAll.next();
  }
}
