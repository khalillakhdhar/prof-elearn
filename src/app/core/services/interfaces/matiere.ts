import { Observable } from "rxjs";

export interface Matiere {
  createMatiere(record:any):void;
  updateMatiere(record:any,id:any):void;
  ReadMatiere(idme:any,idother:any):Observable<any>;
  ReadMyMatiere(id:any):Observable<any>;
  ReadMatiereById(id:any):Object;

}
