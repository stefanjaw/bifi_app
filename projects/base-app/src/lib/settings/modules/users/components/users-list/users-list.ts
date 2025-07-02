import { Component, inject, OnInit, signal } from '@angular/core';
import { tableColumn, TableLayout } from '../../../../../common';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CrudUsers } from '../../services/crud-users';
import { user } from '../../interfaces/user';

@Component({
  selector: 'bifi-app-users-list',
  imports: [TableLayout, MatMenuItem, MatIcon],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  private crudUsers = inject(CrudUsers);
  users = signal<user[]>([]);
  columns = signal<tableColumn[]>([
    {
      field: 'username',
      title: 'Username',
      type: 'text',
    },
    {
      field: 'email',
      title: 'Email',
      type: 'text',
    },
    {
      field: 'name',
      title: 'Name',
      type: 'text',
    },
    {
      field: 'lastName',
      title: 'Last Name',
      type: 'text',
    },
  ]);

  ngOnInit(): void {
    this.users.set(this.crudUsers.getUsers());
  }
}
