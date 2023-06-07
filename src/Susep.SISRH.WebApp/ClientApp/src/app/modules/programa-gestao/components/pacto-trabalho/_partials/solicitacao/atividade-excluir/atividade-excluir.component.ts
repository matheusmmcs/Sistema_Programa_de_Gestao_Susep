import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { IPactoTrabalho, IJustificarEstouroPrazoAtividade, IPactoTrabalhoAtividade, IPactoTrabalhoSolicitacao } from '../../../../../models/pacto-trabalho.model';
import { PactoTrabalhoDataService } from '../../../../../services/pacto-trabalho.service';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'atividade-excluir',
  templateUrl: './atividade-excluir.component.html',
})
export class AtividadeExcluirComponent implements OnInit {

  @Input() dadosPacto: BehaviorSubject<IPactoTrabalho>;

  @Input() solicitacoes: IPactoTrabalhoSolicitacao[];

  atividades: IPactoTrabalhoAtividade[];
  atividadeSelecionada: string;

  form: FormGroup;


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private pactoTrabalhoDataService: PactoTrabalhoDataService) { }

  ngOnInit() {
    this.dadosPacto.subscribe(p => { this.carregarAtividades(); });

    this.form = this.formBuilder.group({
      justificativa: [null, [Validators.required, Validators.minLength(5)]],
    });
    this.form.get('justificativa').markAsDirty();
  }

  carregarAtividades() {
    if (this.dadosPacto.value.atividades) {
      this.dadosPacto.value.atividades.forEach(a => a.adicionadoCalendario = false);
      this.atividades = this.dadosPacto.value.atividades.filter(a => {

        return (a.situacaoId !== 503);

      })
    }
  }

  possuiSolicitacaoPendente(idPactoTrabalhoAtividade) {
    let hasSolicitacoes = false;

    this.solicitacoes.forEach(s => {
      try {
        //apenas solicitacoes de exclusao
        if (s.tipoSolicitacaoId === 604) {
          const sol = JSON.parse(s.dadosSolicitacao);
          //apenas solicitacoes de exclusao para esse pacto especifico e que nao tenha solicitacao sem analise
          if (sol.pactoTrabalhoAtividadeId == idPactoTrabalhoAtividade &&
            s.analisado == false)
            hasSolicitacoes = true;
        }
      } catch (e) {
        console.error(e)
      }
    });

    return hasSolicitacoes;
  }

  possuiSolicitacaoPendenteDesc(idPactoTrabalhoAtividade) {
    return this.possuiSolicitacaoPendente(idPactoTrabalhoAtividade) ? 'Solicitação Pendente' : '';
  }

  justificarEstouroDePrazo() {
    if (this.form.valid) {
      const value = this.form.value;
      const dados: IPactoTrabalhoAtividade = {
        pactoTrabalhoId: this.dadosPacto.value.pactoTrabalhoId,
        pactoTrabalhoAtividadeId: this.atividadeSelecionada,
        justificativa: value.justificativa
      }
      this.pactoTrabalhoDataService.ProporExclusaoAtividade(dados).subscribe(
        r => this.dadosPacto.next(this.dadosPacto.value));
    }
    else {
      this.getFormValidationErrors(this.form)
    }
  }

  toggleSituacao(check: MatSlideToggleChange, pactoTrabalhoAtividadeId: string) {
    this.dadosPacto.value.atividades.forEach(a => a.adicionadoCalendario = false);
    this.atividadeSelecionada = null;

    if (check.checked) {
      this.dadosPacto.value.atividades.filter(a => a.pactoTrabalhoAtividadeId === pactoTrabalhoAtividadeId)[0].adicionadoCalendario = true;
      this.atividadeSelecionada = pactoTrabalhoAtividadeId
    }
  }

  getFormValidationErrors(form) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsDirty({ onlySelf: true });
    });
  }

  fecharModal() {
    this.modalService.dismissAll();
  }
}
