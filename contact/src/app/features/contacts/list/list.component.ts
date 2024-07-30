import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GridComponent } from '@components/grid/grid.component';
import { ColumnKeys, Contact } from '../contact.interfaces';
import { ContactService } from '../contact.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [GridComponent],
  template: `
    <section>
      @if(data){
        <app-grid [displayedColumns]="displayedColumns" [data]="data" [sortableColumns]="sortables"/>
      }
      
    </section>
  `,
 
})
export class ListComponent implements OnInit {
  
  data!: Contact[];
  displayedColumns: ColumnKeys<Contact> = ['id', 'name', 'phone', 'email', 'actions'];
  sortables: ColumnKeys<Contact> = ['id', 'name', 'phone', 'email'];

  private readonly _contactSvc = inject(ContactService);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllContacts();
  }

  getAllContacts() {
    this._contactSvc.getAllContacts().
    pipe(
      takeUntilDestroyed(this._destroyRef),
      tap((contacts:Contact[])=> this.data = [...contacts])
    )
    .subscribe() 
  }
}

