import { IPerfilUsuarioUnidade } from "src/app/shared/models/perfil-usuario.model";
import { IUnidade } from "../../unidade/models/unidade.model";
import { PerfilEnum } from "../enums/perfil.enum";

export class EnumPerfilHelper {

  static onlyPerfilAccepcted(perfil:number) : boolean {
    return PerfilEnum.Administrador == perfil ||
      PerfilEnum.ChefeUnidade == perfil || 
      PerfilEnum.Servidor == perfil || 
      PerfilEnum.Gestor == perfil;
  }

  static getPerfilUnidade(perfilId: number, unidadeIdServidor: number, unidade: IUnidade) : IPerfilUsuarioUnidade | null {
    const perfilDesc = Object.keys(PerfilEnum).filter(p => (PerfilEnum[p] == perfilId && this.onlyPerfilAccepcted(perfilId))).shift();
    return perfilDesc ? {
      perfilDescricao: perfilDesc,
      unidade,
      isUnidadeExercicio: unidade.unidadeId === unidadeIdServidor,
      isUnidadeFilho: unidade.unidadeIdPai === unidadeIdServidor,
      isUnidadePai: unidade.unidadeIdPai !== unidadeIdServidor && unidade.unidadeId !== unidadeIdServidor,
    } : null
  }

}