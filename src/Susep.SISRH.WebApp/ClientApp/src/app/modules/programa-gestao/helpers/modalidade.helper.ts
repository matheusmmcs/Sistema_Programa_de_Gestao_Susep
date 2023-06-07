import { IPactoTrabalhoAtividade } from "../models/pacto-trabalho.model";

export class ModalidadeHelper {

  static descricaoById(formaExecucaoId:number) : string {
    return formaExecucaoId == 103 ? 'Teletrabalho Integral' :
    formaExecucaoId == 102 ? 'Teletrabalho Parcial' :
    formaExecucaoId == 101 ? 'Presencial' : '';
  }

  static checkRemotoPresencial(formaExecucaoId:number) : boolean {
    return formaExecucaoId == 102;
  }

  static descricaoModalidadeAtividade(item:IPactoTrabalhoAtividade) : string {
    return item.execucaoRemota ? 'Remoto' : 'Presencial';
  }
}