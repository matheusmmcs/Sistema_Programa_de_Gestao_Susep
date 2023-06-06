import { Injectable, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements OnInit {

  public identityUrl = '';
  public apiGatewayUrl = '';
  public modo = '';
  public valorPadraoTempoComparecimento = null;
  public valorPadraoTermosUso = null;
  public formaParticipacaoPlanoTrabalho = null;
  public frequenciaPresencialObrigatoria = null;
  public client: IClientConfiguration = {};

  constructor() {
    this.loadEnvFile()
  }

  loadEnvFile() {
    console.log(environment)
    this.identityUrl = environment.identityUrl;
    this.apiGatewayUrl = environment.apiGatewayUrl;
    this.modo = environment.modo;
    this.valorPadraoTempoComparecimento = environment.valorPadraoTempoComparecimento;
    this.valorPadraoTermosUso = environment.valorPadraoTermosUso;
    this.formaParticipacaoPlanoTrabalho = environment.formaParticipacaoPlanoTrabalho;
    this.frequenciaPresencialObrigatoria = environment.frequenciaPresencialObrigatoria;
    this.client = environment.client;
  }

  ngOnInit(): void {
    this.loadEnvFile()
  }

}

export interface IClientConfiguration
{
  id?: string,
  secret?: string,
  scope?: string

}
