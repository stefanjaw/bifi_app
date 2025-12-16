import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksMaintenanceContext {
  private _taskCreatedOrUpdated = new Subject<void>();
  private _toggleExpand = new Subject<string>();
  private _openUpdateTaskDialog = new Subject<string>();
  private _openCreateSubTaskDialog = new Subject<string>();
  private _deleteTask = new Subject<string>();

  taskCreatedOrUpdated$ = this._taskCreatedOrUpdated.asObservable();
  toggleExpand$ = this._toggleExpand.asObservable();
  openUpdateTaskDialog$ = this._openUpdateTaskDialog.asObservable();
  openCreateSubTaskDialog$ = this._openCreateSubTaskDialog.asObservable();
  deleteTask$ = this._deleteTask.asObservable();

  /**
   * Deletes the task with the given id.
   * @param id The id of the task to be deleted.
   */
  deleteTask(id: string) {
    this._deleteTask.next(id);
  }

  /**
   * Opens the create subtask dialog with the task having the given id.
   * @param id The id of the task to be updated.
   */
  openCreateSubTaskDialog(id: string) {
    this._openCreateSubTaskDialog.next(id);
  }

  /**
   * Opens the update task dialog with the task having the given id.
   * @param id The id of the task to be updated.
   */
  openUpdateTaskDialog(id: string) {
    this._openUpdateTaskDialog.next(id);
  }

  /**
   * Notifies components that the task with the given id should be expanded/collapsed.
   * @param id The id of the task to be expanded/collapsed.
   */
  toggleExpand(id: string) {
    this._toggleExpand.next(id);
  }

  /**
   * Emits the taskCreatedOrUpdated event to notify components that a task has been created or updated.
   */
  taskCreatedOrUpdated() {
    this._taskCreatedOrUpdated.next();
  }
}
