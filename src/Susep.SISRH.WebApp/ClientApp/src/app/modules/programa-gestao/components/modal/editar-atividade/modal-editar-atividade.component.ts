import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DecimalValuesHelper } from 'src/app/shared/helpers/decimal-valuesr.helper';
import { IDominio } from 'src/app/shared/models/dominio.model';
import { IPactoTrabalho, IPactoTrabalhoAtividade } from '../../../models/pacto-trabalho.model';

@Component({
selector: 'modal-editar-atividade',
templateUrl: './modal-editar-atividade.component.html',
})
export class ModalEditarAtividadeComponent {

  @Input() dadosPacto: BehaviorSubject<IPactoTrabalho>;
  @Input() situacoes: IDominio[];
  @Input() atividadeEdicao: IPactoTrabalhoAtividade = { quantidade: 1 };
  @Input() alterarAtividade: (dados: IPactoTrabalhoAtividade)=>void;

  form: FormGroup;
  situacaoId: number;
  
  public tempoMask: any;
  minDataInicio: any;
  maxDataInicio: any;
  minDataConclusao: any;
  maxDataConclusao: any;

constructor(
    public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder,
    private decimalValuesHelper: DecimalValuesHelper,
  ) {}

  init() {
    this.form = this.formBuilder.group({
      situacaoId: [null, [Validators.required]],
      dataInicio: [null, []],
      dataFim: [null, []],
      tempoRealizado: [null, []],
      descricao: ['', []],
      consideracoes: ['', [Validators.maxLength(2000)]],
    });
    this.tempoMask = this.decimalValuesHelper.numberMask(3, 1);
  }

  initDateValidation() {
    this.minDataInicio = this.formatarData(new Date(this.dadosPacto.value.dataInicio));
    this.maxDataInicio = this.formatarData(new Date());

    this.minDataConclusao = this.formatarData(new Date(this.getDataInicio()));
    this.maxDataConclusao = this.formatarData(new Date());
  }

  formatarData(data: Date) {
    return {
      'year': data.getFullYear(),
      'month': data.getMonth() + 1,
      'day': data.getDate()
    };
  }
  
  fillForm() {
    this.form.patchValue({
      situacaoId: this.atividadeEdicao.situacaoId,
      dataInicio: this.atividadeEdicao.dataInicio,
      dataFim: this.atividadeEdicao.dataFim,
      tempoRealizado: this.atividadeEdicao.tempoRealizado,
      descricao: this.atividadeEdicao.descricao,
      consideracoes: this.atividadeEdicao.consideracoes,
    });
    this.situacaoId = this.atividadeEdicao.situacaoId; 
    this.form.controls['descricao'].disable();
  }

  mudarSituacao(value) {
    this.situacaoId = value;
    if (+value === 501) {
      this.form.get('dataInicio').setValue(null);
      this.form.get('dataInicio').clearValidators();
      this.form.get('dataFim').setValue(null);
      this.form.get('dataFim').clearValidators();
      this.form.get('tempoRealizado').setValue(null);
      this.form.get('tempoRealizado').clearValidators(); 
      this.form.get('consideracoes').setValue(null);
      this.form.get('consideracoes').clearValidators();
    }
    else if (+value === 502) {
      this.form.get('dataInicio').setValidators(Validators.required);
      this.form.get('dataFim').setValue(null);
      this.form.get('dataFim').clearValidators();
      this.form.get('tempoRealizado').setValue(null);
      this.form.get('tempoRealizado').clearValidators();
      this.form.get('consideracoes').clearValidators();
    }                 
    else {
      this.form.get('dataInicio').setValidators(Validators.required);
      this.form.get('dataFim').setValidators(Validators.required);
      this.form.get('tempoRealizado').setValidators(Validators.required);
      this.form.get('consideracoes').setValidators(Validators.required);
    }
    this.form.get('dataInicio').updateValueAndValidity();
    this.form.get('dataFim').updateValueAndValidity();
    this.form.get('tempoRealizado').updateValueAndValidity();
    this.form.get('consideracoes').updateValueAndValidity();
  }

  editarAtividade() {
    if (this.form.valid) {
      const dados: IPactoTrabalhoAtividade = this.form.value;
      dados.pactoTrabalhoId = this.dadosPacto.value.pactoTrabalhoId;
      dados.pactoTrabalhoAtividadeId = this.atividadeEdicao.pactoTrabalhoAtividadeId;
      dados.dataInicio = this.form.get('dataInicio').value;
      dados.dataFim = this.form.get('dataFim').value;
      dados.consideracoes = this.form.get('consideracoes').value;
      this.alterarAtividade(dados);
    }
    else {
      this.getFormValidationErrors(this.form)
    }
  }

  getFormValidationErrors(form) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsDirty({ onlySelf: true });
    });
  }

  getDataInicio() {
    if (this.form.get('dataInicio').value)
      return this.form.get('dataInicio').value;
    return this.dadosPacto.value.dataInicio;
  }

  alterarDataInicio() {
    const dataInicio = new Date(this.getDataInicio());    
    this.minDataConclusao = this.formatarData(dataInicio);

    if (this.form.get('dataFim').value) {
      const dataFim = new Date(this.form.get('dataFim').value);
      if (dataFim < dataInicio)
        this.form.get('dataFim').setValue(null);
    }    
  }

  fecharModal() {
    this.atividadeEdicao = {};
    this.activeModal.dismiss();
  }
}