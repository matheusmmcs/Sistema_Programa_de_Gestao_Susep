import { IUnidade } from "src/app/modules/unidade/models/unidade.model";

export interface IUsuario {  
  pessoaId: number;
  nome: string;
  unidadeId: number;
  perfis: IPerfilUsuario[];
}

export interface IPerfilUsuario
{
  perfil: number;
  unidades?: number[];
}

export interface IPerfilUsuarioUnidade
{
  perfilDescricao: string
  unidade: IUnidade
  isUnidadePai: boolean
  isUnidadeFilho: boolean
  isUnidadeExercicio: boolean
}