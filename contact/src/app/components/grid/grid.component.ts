import { Component, effect, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInput} from '@angular/material/input';
import { FilterComponent } from "./filter/filter.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONSTANTS } from '@shared/constants';
import { ContactService } from '@features/contacts/contact.service';
import { ModalService } from '@components/modal/modal.service';
import { ModalComponent } from '@components/modal/modal.component';
const MATERIAL_MODULES = [MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule ];

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MATERIAL_MODULES, FilterComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent<T> implements OnInit {
  
 
  displayedColumns = input.required<string[]>();
  data = input.required<T[]>();
  sortableColumns = input<string[]>([]);

  dataSource = new MatTableDataSource<T>();
  valueToFilter = signal('');
  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);
  private readonly _contactSvc = inject(ContactService);
  private readonly _modalSvc = inject(ModalService);

  constructor() {
    effect(() => {
      if(this.valueToFilter()){
        this.dataSource.filter = this.valueToFilter();
      }else {
        this.dataSource.filter = '';
      }
    }, {allowSignalWrites: true});
   }

  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
  }
  
  openEditForm(data: T): void {
    this._modalSvc.openModal<ModalComponent, T>(ModalComponent, data, true);
  }

  deleteContact(id: string): void {
    const confirmation = confirm(APP_CONSTANTS.MESSAGES.CONFIRMATION_PROMPT);
    if (confirmation) {
      // service
      this._contactSvc.deleteContact(id);
    }
  }
}
