import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'modal-visualizar-atividade',
templateUrl: './modal-visualizar-atividade.component.html',
})
export class ModalVisualizarAtividadeComponent {

  descricao: string;
  consideracoes: string;
  @Input() situacaoIdDetalhes: number;
  form: FormGroup;

constructor(
    public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder,
  ) {}

  init() {
    this.form = this.formBuilder.group({
      descricao: [null, []],
      consideracoes: ['', []]
    });
  }
  
  fillForm({descricao, consideracoes}) {
    this.form.patchValue({
      descricao,
      consideracoes
    });
    this.form.disable();
  }

  fecharModal() {
    this.activeModal.dismiss();
  }
}