import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoService } from '../../services/catalogo.service';
import { Canasta } from '../../models/canasta.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-canasta-form',
  templateUrl: './canasta-form.component.html',
  imports: [ReactiveFormsModule, CurrencyPipe],
})
export class CanastaFormComponent implements OnInit {
  @Output() canastaAgregada = new EventEmitter<{ canasta: Canasta; cantidad: number }>();

  canastaForm!: FormGroup;
  canastasDisponibles: Canasta[] = [];

  constructor(private fb: FormBuilder, private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    // Obtener catálogo de canastas desde el servicio
    this.canastasDisponibles = this.catalogoService.getCanastas();

    // Inicializar formulario reactivo
    this.canastaForm = this.fb.group({
      canastaId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  agregarCanasta() {
    const { canastaId, cantidad } = this.canastaForm.value;

    const canastaSeleccionada = this.canastasDisponibles.find((c) => c.id === canastaId);

    if (canastaSeleccionada) {
      this.canastaAgregada.emit({ canasta: canastaSeleccionada, cantidad });
      this.canastaForm.reset({ cantidad: 1 });
    }
  }
}
