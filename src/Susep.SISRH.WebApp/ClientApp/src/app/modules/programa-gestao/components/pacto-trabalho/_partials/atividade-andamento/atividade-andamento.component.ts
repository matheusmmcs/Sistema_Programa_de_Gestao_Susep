import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { IDominio } from '../../../../../../shared/models/dominio.model';
import { DominioDataService } from '../../../../../../shared/services/dominio.service';
import { IPactoTrabalho, IPactoTrabalhoAtividade, IAvaliacaoAtividade } from '../../../../models/pacto-trabalho.model';
import { PactoTrabalhoDataService } from '../../../../services/pacto-trabalho.service';
import { PerfilEnum } from '../../../../enums/perfil.enum';
import { IUsuario } from '../../../../../../shared/models/perfil-usuario.model';
import { ApplicationStateService } from '../../../../../../shared/services/application.state.service';
import { SortingHelper } from 'src/app/shared/helpers/sorting.helper';
import { ISortConfig } from 'src/app/shared/models/sortConfig.model';
import { ModalEditarAtividadeComponent } from '../../../modal/editar-atividade/modal-editar-atividade.component';
import { ModalVisualizarAtividadeComponent } from '../../../modal/visualizar-atividade/modal-visualizar-atividade.component';
import { ModalAvaliarAtividadeComponent } from '../../../modal/avaliar-atividade/modal-avaliar-atividade.component';

@Component({
  selector: 'pacto-lista-atividade-andamento',
  templateUrl: './atividade-andamento.component.html',
})
export class PactoListaAtividadeAndamentoComponent implements OnInit {

  PerfilEnum = PerfilEnum;

  @Input() dadosPacto: BehaviorSubject<IPactoTrabalho>;
  servidor = new BehaviorSubject<number>(null);
  servidorPacto = new BehaviorSubject<number>(null);
  unidadePacto = new BehaviorSubject<number>(null);

  @Input() readOnly: Boolean;
  @Input() isReadOnly = new BehaviorSubject<Boolean>(true);

  situacoes: IDominio[];
  situacoesAux: IDominio[];

  atividadeAvaliacao: IPactoTrabalhoAtividade;

  tempoPrevistoTotal = 0;
  tempoRealizado = 0;
  tempoHomologado = 0;

  usuarioPodeAvaliar: boolean;
  perfilUsuario: IUsuario;
  gestorUnidade: boolean;
  teletrabalhoParcial: boolean;

  sortConfig: ISortConfig;

  constructor(
    private modalService: NgbModal,
    private applicationState: ApplicationStateService,
    private pactoTrabalhoDataService: PactoTrabalhoDataService,
    private dominioDataService: DominioDataService) { }

  ngOnInit() {
    this.applicationState.perfilUsuario.subscribe(appResult => {
      this.perfilUsuario = appResult;
      this.gestorUnidade = this.perfilUsuario.perfis.filter(p =>
        p.perfil === PerfilEnum.Gestor ||
        p.perfil === PerfilEnum.Administrador ||
        p.perfil === PerfilEnum.Diretor ||
        p.perfil === PerfilEnum.CoordenadorGeral ||
        p.perfil === PerfilEnum.ChefeUnidade).length > 0;

      this.verificarSeUsuarioPodeAceitar();
    });

    this.sortConfig = {key:'itemCatalogo', order: 'asc'}
    this.dadosPacto.subscribe(val => this.carregarAtividades());

    this.dominioDataService.ObterSituacaoAtividadePactoTrabalho().subscribe(
      appResult => {
        this.situacoes = appResult.retorno;
        this.situacoesAux = appResult.retorno;
      }
    );
  }

  verificarSeUsuarioPodeAceitar() {
    if (this.perfilUsuario.pessoaId && this.dadosPacto.value.responsavelEnvioAceite) {

      this.usuarioPodeAvaliar =
        (this.perfilUsuario.pessoaId !== this.dadosPacto.value.pessoaId && this.dadosPacto.value.situacaoId >= 405);
    }
  }

  carregarAtividades() {    
    this.verificarSeUsuarioPodeAceitar();

    this.teletrabalhoParcial = this.dadosPacto.value.formaExecucaoId === 102;

    this.servidor.next(this.dadosPacto.value.pessoaId);
    this.servidorPacto.next(this.dadosPacto.value.pessoaId);
    this.unidadePacto.next(this.dadosPacto.value.unidadeId);
    this.isReadOnly.next(this.readOnly || this.dadosPacto.value.situacaoId !== 405);
    this.pactoTrabalhoDataService.ObterAtividades(this.dadosPacto.value.pactoTrabalhoId).subscribe(
      resultado => {
        this.dadosPacto.value.atividades = resultado.retorno;
        this.tempoPrevistoTotal = this.dadosPacto.value.atividades.reduce((a, b) => a + b.tempoPrevistoTotal, 0);
        this.tempoRealizado = this.dadosPacto.value.atividades.reduce((a, b) => a + b.tempoRealizado, 0);
        this.tempoHomologado = this.dadosPacto.value.atividades.reduce((a, b) => a + b.tempoHomologado, 0);
        //sort list itens
        this.dadosPacto.value.atividades = SortingHelper.sort(
          this.dadosPacto.value.atividades,
          this.sortConfig
        )
      }
    );
      
  }

  modalVisualizar(pactoTrabalhoAtividadeId: string) {
    const atividade = this.dadosPacto.value.atividades.filter(a => a.pactoTrabalhoAtividadeId === pactoTrabalhoAtividadeId)[0];
    const modalRef = this.modalService.open(ModalVisualizarAtividadeComponent, { size: 'sm' });
    modalRef.componentInstance.init();
    modalRef.componentInstance.fillForm({
      descricao: atividade.descricao,
      consideracoes: atividade.consideracoes
    });
    modalRef.componentInstance.situacaoIdDetalhes = atividade.situacaoId;
  }

  modalEditar(pactoTrabalhoAtividadeId: string) {
    const atividadeEdicao = this.dadosPacto.value.atividades.filter(a => a.pactoTrabalhoAtividadeId === pactoTrabalhoAtividadeId)[0];
    const modalRef = this.modalService.open(ModalEditarAtividadeComponent, { size: 'sm' });
    modalRef.componentInstance.init();
    modalRef.componentInstance.situacoes = this.situacoes;
    modalRef.componentInstance.atividadeEdicao = atividadeEdicao;
    modalRef.componentInstance.dadosPacto = this.dadosPacto;
    modalRef.componentInstance.alterarAtividade = (dados: IPactoTrabalhoAtividade) => {
      this.pactoTrabalhoDataService.AlterarAndamentoAtividade(dados).subscribe(
        r => {
          if (r.retorno) {
            this.carregarAtividades();
          }
      });
    };
    modalRef.componentInstance.initDateValidation();
    modalRef.componentInstance.mudarSituacao(atividadeEdicao.situacaoId);
    modalRef.componentInstance.fillForm();
  }

  modalAvaliar(pactoTrabalhoAtividadeId: string) {
    const atividade = this.dadosPacto.value.atividades.filter(a => a.pactoTrabalhoAtividadeId === pactoTrabalhoAtividadeId)[0];
    const modalRef = this.modalService.open(ModalAvaliarAtividadeComponent, { size: 'sm' });
    modalRef.componentInstance.init();
    modalRef.componentInstance.atividadeAvaliacao = atividade;
    modalRef.componentInstance.usuarioPodeAvaliar = this.usuarioPodeAvaliar;
    modalRef.componentInstance.fillForm();
    modalRef.componentInstance.avaliarAtividade = (dados: IAvaliacaoAtividade) => {
      this.pactoTrabalhoDataService.AvaliarAtividade(atividade.pactoTrabalhoId, atividade.pactoTrabalhoAtividadeId, dados).subscribe(
        appResult => {
          this.carregarAtividades();
        });
    }
  }

  changeOrderList(value:string) {
    const order = this.sortConfig.key===value ? (this.sortConfig.order==='desc' ? 'asc' : 'desc') : 'asc';
    this.sortConfig = {key:value, order};
    this.carregarAtividades();
  }
}
