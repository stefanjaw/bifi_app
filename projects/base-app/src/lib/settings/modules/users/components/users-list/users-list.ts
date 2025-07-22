import { Component } from '@angular/core';
import { TableLayout } from '../../../../../system';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'bifi-app-users-list',
  imports: [TableLayout, MatMenuItem, MatIcon],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList {
  // private crudUsers = inject(CrudUsers);
  // users = signal<user[]>([]);
  // columns = signal<tableColumn[]>([
  //   {
  //     field: 'username',
  //     title: 'Username',
  //     type: 'text',
  //   },
  //   {
  //     field: 'email',
  //     title: 'Email',
  //     type: 'text',
  //   },
  //   {
  //     field: 'name',
  //     title: 'Name',
  //     type: 'text',
  //   },
  //   {
  //     field: 'lastName',
  //     title: 'Last Name',
  //     type: 'text',
  //   },
  // ]);
  // ngOnInit(): void {
  //   this.users.set(this.crudUsers.getUsers());
  // }
}
