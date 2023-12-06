import { Observable } from "rxjs";

export interface Cours {
  createCours(record:any):void;
  updateCours(record:any,id:any):void;
  ReadCours(idme:any,idother:any):Observable<any>;
  ReadMyCours(id:any):Observable<any>;
  ReadCoursById(id:any):Object;
}
