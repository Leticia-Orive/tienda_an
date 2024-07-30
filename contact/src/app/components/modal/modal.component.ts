import { Component, inject, OnInit, Type } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ContactService } from '@features/contacts/contact.service';
import { ModalService } from './modal.service';
import { APP_CONSTANTS } from '@shared/constants';
import { MatButtonModule } from '@angular/material/button';

const MATERIAL_MODULES= [MatLabel, MatFormField, MatInput, MatDialogModule, MatButtonModule];
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  
  contactForm!: FormGroup;
  private readonly _fb = inject(FormBuilder);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _contactSvc = inject(ContactService);
  private readonly _modalSvc = inject(ModalService);

ngOnInit(): void {
    this._buildForm();
    this.contactForm.patchValue(this._matDialog.data); 
   
  }

  async onSubmit(){
    let message = APP_CONSTANTS.MESSAGES.CONTACT_UPDATED;
    const contact = this.contactForm.value;
    if (this._matDialog.data){
      this._contactSvc.updateContact(this._matDialog.data.id, contact);
    }else{
      await this._contactSvc.newContact(contact);
      message = APP_CONSTANTS.MESSAGES.CONTACT_ADDED;
    }
    //show snackBar
    console.log(message);
    this._modalSvc.closeModal();
  }

  getTitle(): string{
    return this._matDialog.data ? 'Edit Contact' : 'New Contact';
  }

  
  private _buildForm(): void {
    this.contactForm = this._fb.nonNullable.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],

})
  }

}
