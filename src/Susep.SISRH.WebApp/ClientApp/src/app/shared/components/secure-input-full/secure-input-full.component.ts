import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PerfilEnum } from '../../../modules/programa-gestao/enums/perfil.enum';
import { IUsuario } from '../../models/perfil-usuario.model';
import { ApplicationStateService } from '../../services/application.state.service';

@Component({
  selector: 'secure-input-full',
  templateUrl: './secure-input-full.component.html'
})
export class SecureInputFullComponent implements OnInit {

  @Input() perfis: number[];
  @Input() unidade: BehaviorSubject<number>;
  @Input() servidor: BehaviorSubject<number>;

  temAcesso: boolean;
  perfilUsuario: IUsuario;

  constructor(private applicationStateService: ApplicationStateService) { }  

  ngOnInit() {
    this.temAcesso = false;
    this.applicationStateService.perfilUsuario.subscribe(perfis => {
      this.perfilUsuario = perfis;
      this.verificaAcesso();
    });
  }

  verificaAcesso() {
    if (this.perfilUsuario) {
      const perfisUsuario = this.perfilUsuario.perfis;

      if (perfisUsuario.filter(p => p.perfil === PerfilEnum.Gestor || p.perfil === PerfilEnum.Administrador).length > 0) {
        this.temAcesso = true;
      } else {

        let achouPerfil = false;
        this.perfis.forEach(pi => {
          perfisUsuario.forEach(pu => {
            if (pi === pu.perfil) {
              //se especificar unidade, apenas perfis naquela unidade acessam
              if (this.unidade != null) {
                achouPerfil = pu.unidades.indexOf(this.unidade.value) != -1;
              } else {
                achouPerfil = true;
              }
            }
          })
        });

        //caso seja informado servidor
        if (this.servidor != null && this.perfilUsuario.pessoaId === this.servidor.value &&
          perfisUsuario.filter(pu => {
            return pu.perfil === PerfilEnum.Servidor && (this.unidade != null ? pu.unidades.indexOf(this.unidade.value) : true)
          }).length > 0) {
            achouPerfil = true;
        }

        this.temAcesso = achouPerfil;
      }
    }
  }

}