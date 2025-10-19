import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent {
  @Output() clienteGuardado = new EventEmitter<any>();

  clientForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      empresa: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      contacto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      distrito: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    const clienteData = this.clientForm.value;
    console.log('Datos del cliente:', clienteData);

    // 👉 Emitimos los datos al componente padre
    this.clienteGuardado.emit(clienteData);
  }
}
