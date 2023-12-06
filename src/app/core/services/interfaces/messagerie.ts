import { Observable } from "rxjs";

export interface Messagerie {
  createMessagerie(record:any):void;
  updateMessagerie(record:any,id:any):void;
  deleteMessagerie(id:any):void;
  ReadMessageries(idme:any,idother:any):Observable<any>;
  ReadMyMessageries(id:any):Observable<any>;
}
