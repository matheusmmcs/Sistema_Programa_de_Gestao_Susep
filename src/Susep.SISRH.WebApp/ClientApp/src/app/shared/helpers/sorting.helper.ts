import { ISortConfig } from "../models/sortConfig.model";

export class SortingHelper {

  static sort(list: Array<any>, sortConfig: ISortConfig) {
    const { key, order } = sortConfig;
    return list.sort((a,b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      
      const regDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/g;
      if (regDate.test(varA) || regDate.test(varB)) {
        comparison = (varA == null && varB == null) ? 0 : (varA == null ? 1 : (varB == null ? -1 : comparison ) ); 
      }

      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    });
  }

}