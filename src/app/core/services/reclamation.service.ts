
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Reclamation } from '../models/reclamation';

@Injectable({
  providedIn: 'root'
})
export class ReclamationsService {
  url=" http://localhost:8080/reclamation"

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,

  ) { }


  create_NewReclamation(record) {
    let reclamation=new Reclamation();
    reclamation.email=record.email;
    reclamation.message=record.message;
    reclamation.type="reclamation"
    this.http.post<Reclamation>(this.url, reclamation).subscribe(data=>{
      console.log(data);
     });
    return this.firestore.collection('Reclamation').add(record);
  }

  read_Reclamations() {
    return this.firestore.collection('Reclamation').snapshotChanges();
  }
  // readReclamations by id
  read_Reclamation(record_id) {
    return this.firestore.collection('Reclamation').doc(record_id).snapshotChanges();
  }


  read_technique(type:string) {
    return this.firestore.collection("Reclamation", (ref) => ref.where("type", "==", type))
    .snapshotChanges();
  }
  read_current(email) {
    return this.firestore.collection("Reclamation", (ref) => ref.where("email", "==", email))
    .snapshotChanges();
  }


  delete_Reclamation(record_id) {
    this.firestore.doc('Reclamation/' + record_id).delete();
  }
}
