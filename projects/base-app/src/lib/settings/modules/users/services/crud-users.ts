import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../common';
import { user } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends ApiRequestManager {
  constructor() {
    super();
  }

  getUsers(): user[] {
    return [
      {
        _id: '1a2b3c4d5e',
        username: 'coolCat99',
        email: 'coolcat99@example.com',
        name: 'Carlos',
        lastName: 'González',
      },
      {
        _id: '2b3c4d5e6f',
        username: 'jazzMaster',
        email: 'jazzmaster@example.com',
        name: 'Ana',
        lastName: 'Martínez',
      },
      {
        _id: '3c4d5e6f7g',
        username: 'sunnyDays',
        email: 'sunnydays@example.com',
        name: 'Miguel',
        lastName: 'Rojas',
      },
      {
        _id: '4d5e6f7g8h',
        username: 'codeHero',
        email: 'codehero@example.com',
        name: 'Laura',
        lastName: 'Morales',
      },
      {
        _id: '5e6f7g8h9i',
        username: 'nightOwl',
        email: 'nightowl@example.com',
        name: 'Javier',
        lastName: 'Díaz',
      },
      {
        _id: '6f7g8h9i0j',
        username: 'bookWorm',
        email: 'bookworm@example.com',
        name: 'Sofía',
        lastName: 'Herrera',
      },
      {
        _id: '7g8h9i0j1k',
        username: 'traveler',
        email: 'traveler@example.com',
        name: 'Fernando',
        lastName: 'Vargas',
      },
      {
        _id: '8h9i0j1k2l',
        username: 'guitarGod',
        email: 'guitargod@example.com',
        name: 'María',
        lastName: 'Castro',
      },
      {
        _id: '9i0j1k2l3m',
        username: 'sportySpice',
        email: 'sportyspice@example.com',
        name: 'Ricardo',
        lastName: 'Pérez',
      },
      {
        _id: '0j1k2l3m4n',
        username: 'artLover',
        email: 'artlover@example.com',
        name: 'Lucía',
        lastName: 'Sánchez',
      },
    ];
  }
}
