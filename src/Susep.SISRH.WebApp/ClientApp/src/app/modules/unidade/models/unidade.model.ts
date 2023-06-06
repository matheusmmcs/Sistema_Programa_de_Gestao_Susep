export interface IUnidade
{
  unidadeId: number;
  descricao: string;
  sigla: string;

  siglaCompleta?: string;
  nome?: string;
  nivel?: number;
  unidadeIdPai?: number;
}
