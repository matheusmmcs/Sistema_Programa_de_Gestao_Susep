import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUnidade } from 'src/app/modules/unidade/models/unidade.model';
import { IPerfilUsuarioUnidade, IUsuario } from '../models/perfil-usuario.model';
import { StorageService } from './storage.service';

@Injectable()
export class ApplicationStateService {

  private isAuthenticatedMessage = new BehaviorSubject<boolean>(false);
  isAuthenticated = this.isAuthenticatedMessage.asObservable();

  private isLoadingMessage = new BehaviorSubject<boolean>(false);
  isLoading = this.isLoadingMessage.asObservable();

  private unidadeUsuarioMessage = new BehaviorSubject<IUnidade>(null);
  unidadeUsuario = this.unidadeUsuarioMessage.asObservable();

  private perfilUsuarioMessage = new BehaviorSubject<IUsuario>(null);
  perfilUsuario = this.perfilUsuarioMessage.asObservable();

  private perfisUsuarioPorUnidadeMessage = new BehaviorSubject<IPerfilUsuarioUnidade[]>(null);
  perfisUsuarioPorUnidade = this.perfisUsuarioPorUnidadeMessage.asObservable();

  private modalOpenMessage = new BehaviorSubject<string>(null);
  modalOpen = this.modalOpenMessage.asObservable();


  constructor(private storageService: StorageService) {
    const isAuth = this.storageService.retrieve('isAuthenticated');
    this.changeAuthenticatedInformation(isAuth);

    const perfis = this.storageService.retrieve('perfilUsuario');
    this.changePerfisUsuario(perfis);

    const unidade = this.storageService.retrieve('unidadeUsuario');
    this.changeUnidadeUsuario(unidade);

    const perfisUsuarioUnd = this.storageService.retrieve('perfisUsuarioPorUnidade');
    this.changePerfisUsuarioPorUnidade(perfisUsuarioUnd);
  }

  changeAuthenticatedInformation(authenticated: boolean) {
    this.storageService.store('isAuthenticated', authenticated);
    this.isAuthenticatedMessage.next(authenticated);
  }

  changePerfisUsuario(perfil: IUsuario) {
    this.storageService.store('perfilUsuario', perfil);
    this.perfilUsuarioMessage.next(perfil);
  }

  changeUnidadeUsuario(unidade: IUnidade) {
    this.storageService.store('unidadeUsuario', unidade);
    this.unidadeUsuarioMessage.next(unidade);
  }

  changePerfisUsuarioPorUnidade(perfis: IPerfilUsuarioUnidade[]) {
    this.storageService.store('perfisUsuarioPorUnidade', perfis);
    this.perfisUsuarioPorUnidadeMessage.next(perfis);
  }

  changeLoadingStatus(loading: boolean) {
    this.isLoadingMessage.next(loading)
  }

  changeOpenModal(nome: string) {
    this.modalOpenMessage.next(nome);
  }

}
