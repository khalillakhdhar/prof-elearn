import { Observable } from "rxjs";

export interface Evaluation {
  createEvaluation(record:any):void;
  updateEvaluation(record:any,id:any):void;
  ReadEvaluation(idme:any,idother:any):Observable<any>;
  ReadMyEvaluation(id:any):Observable<any>;
  ReadEvaluationById(id:any):Object;

}
