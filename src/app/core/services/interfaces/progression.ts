import { Observable } from "rxjs";

export interface Progression {
  createProgression(record:any):void;
  updateProgression(record:any,id:any):void;
  ReadProgression(idme:any,idother:any):Observable<any>;
  ReadMyProgression(id:any):Observable<any>;

}
