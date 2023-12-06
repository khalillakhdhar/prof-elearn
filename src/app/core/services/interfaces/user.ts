import { Observable } from "rxjs";

export interface User {
  createUser(record:any, uid: any):object;
  updateUser(record:any,id:string):Object;
  deleteUser(id:any):Object;
  ReadUsers():Observable<any>;
  ReadMe():Object;
  ReadById(id:any):Object;
  ReadByEmail(email:string):Object;
}
