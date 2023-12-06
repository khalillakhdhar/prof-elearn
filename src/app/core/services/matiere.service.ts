
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Evaluation } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  url="http://localhost:8080/evaluation"

  constructor(
    private firestore: AngularFirestore,
    // http service
    private http: HttpClient,
  ) { }


  create_NewMatiere(record) {
    return this.firestore.collection('Quizz').add(record);
  }
  create_NewEvaluation(record) {
let evaluation=new Evaluation();
evaluation.note=record.note;
evaluation.etudiant=record.etudiant;
console.log("eval",evaluation)
    this.http.post<Evaluation>(this.url,evaluation ).subscribe(data=>{
      console.log(data);
     });

    return this.firestore.collection('evaluation').add(record);
  }

  read_Matieres() {
    return this.firestore.collection('Quizz').snapshotChanges();
  }


  update_Matiere(recordID, record) {
    this.firestore.doc('Quizz/' + recordID).update(record);
    console.log('updated');
  }

  delete_Matiere(record_id) {
    this.firestore.doc('Quizz/' + record_id).delete();
  }
}
