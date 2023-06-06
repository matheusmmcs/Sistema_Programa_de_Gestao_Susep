import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../../services/security.service';
import { ApplicationStateService } from '../../../services/application.state.service';
import { IUsuario } from '../../../models/perfil-usuario.model';
import { Router } from '@angular/router';
import { IUnidade } from 'src/app/modules/unidade/models/unidade.model';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html'
})
export class IdentityComponent implements OnInit {

  public isAuthenticated: boolean;

  perfil: IUsuario;
  unidade: IUnidade;

  constructor(
    private applicationState: ApplicationStateService,
    private securityService: SecurityService,
    private router: Router) { } 

  ngOnInit() { 

    this.applicationState.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    this.applicationState.perfilUsuario.subscribe(appResult => {
      this.perfil = appResult;
    });

    this.applicationState.unidadeUsuario.subscribe(appResult => {
      this.unidade = appResult;
    });
    
  }

  logoutClicked(event: any) {
    
    event.preventDefault();
    this.logout();
  }

  login() {
    this.securityService.goToAuthentication();
  }

  logout() {    
    this.securityService.logoff();
  }
}
