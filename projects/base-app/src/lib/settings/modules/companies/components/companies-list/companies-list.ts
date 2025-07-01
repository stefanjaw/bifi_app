import { Component, inject, OnInit, signal } from '@angular/core';
import { CrudCompanies } from '../../services/crud-companies';
import { company } from '../../interfaces/company';
import { tableColumn, TableLayout } from '../../../../../common';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'bifi-app-companies-list',
  imports: [TableLayout, MatMenuItem, MatIcon],
  templateUrl: './companies-list.html',
  styleUrl: './companies-list.css',
})
export class CompaniesList implements OnInit {
  private crudCompanies = inject(CrudCompanies);
  companies = signal<company[]>([]);
  columns = signal<tableColumn[]>([
    {
      field: 'name',
      title: 'Company',
      type: 'text',
    },
  ]);

  ngOnInit(): void {
    this.companies.set(this.crudCompanies.getCompanies());
  }
}
