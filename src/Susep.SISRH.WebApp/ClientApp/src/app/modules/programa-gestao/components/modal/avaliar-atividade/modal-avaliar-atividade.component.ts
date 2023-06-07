import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAvaliacaoAtividade, IPactoTrabalhoAtividade } from '../../../models/pacto-trabalho.model';

@Component({
selector: 'modal-avaliar-atividade',
templateUrl: './modal-avaliar-atividade.component.html',
})
export class ModalAvaliarAtividadeComponent {

  @Input() atividadeAvaliacao: IPactoTrabalhoAtividade;
  @Input() usuarioPodeAvaliar: boolean;
  @Input() avaliarAtividade: (dados: IAvaliacaoAtividade)=>void;
  form: FormGroup;

constructor(
    public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder,
  ) {}

  init() {
    this.form = this.formBuilder.group({
      avaliacao: [null, []],
      justificativa: ['', [
        this.validarJustificativaSeAvaliacaoInferiorA(5)
      ]]
    });
  }
  
  fillForm() {
    if (this.atividadeAvaliacao.nota) {
      this.form.patchValue({
        avaliacao: this.atividadeAvaliacao.nota,
        justificativa: this.atividadeAvaliacao.justificativa
      })
    } else {
      this.form.reset();
    }

    if (!this.usuarioPodeAvaliar) {
      this.form.get('avaliacao').disable();
      this.form.get('justificativa').disable();
    }
  }

  private validarJustificativaSeAvaliacaoInferiorA(avaliacaoMinima: number) {

    let justificativaControl: FormControl;
    let avaliacaoControl: FormControl;

    return (control: FormControl) => {
      if (!control.parent) return null;

      if (!justificativaControl) {
        justificativaControl = control;
        avaliacaoControl = control.parent.get('avaliacao') as FormControl;
        avaliacaoControl.valueChanges.subscribe(() => {
          justificativaControl.updateValueAndValidity();
        });
      }

      const avaliacao: number = avaliacaoControl.value;
      const justificativa: string = justificativaControl.value;

      const avaliacaoNula = avaliacao !== 0 && !avaliacao;
      const avaliacaoMenorQueMinimoEJustificativaNaoPreenchida = avaliacao < avaliacaoMinima && (!justificativa || justificativa.length < 5);
      if (avaliacaoNula || avaliacaoMenorQueMinimoEJustificativaNaoPreenchida)
        return { required: true };

      return null;
    };
  }

  salvarAvaliacao() {
    if (this.usuarioPodeAvaliar && this.form.valid) {
      const dadosForm = this.form.value;
      const dados: IAvaliacaoAtividade = {
        nota: dadosForm.avaliacao,
        justificativa: dadosForm.justificativa
      };
      this.avaliarAtividade(dados);
    }
  }

  fecharModal() {
    this.activeModal.dismiss();
  }
}