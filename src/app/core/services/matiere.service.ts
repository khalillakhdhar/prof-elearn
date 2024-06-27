import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evaluation } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  url="http://localhost:8080/evaluation"

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) { }

  readQuiz(fileName: string): Observable<any[]> {
    return this.http.get(`/assets/${fileName}`, { responseType: 'text' }).pipe(
      map(data => this.parseCSV(data))
    );
  }

  private parseCSV(data: string): any[] {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const parsedQuiz = [];
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      parsedQuiz.push(obj);
    }
    return parsedQuiz;
  }

  

 

  create_NewMatiere(record) {
    return this.firestore.collection('Quizz').add(record);
  }

  create_NewEvaluation(record) {
    let evaluation = new Evaluation();
    evaluation.note = record.note;
    evaluation.etudiant = record.etudiant;
    console.log("eval", evaluation);
    this.http.post<Evaluation>(this.url, evaluation).subscribe(data => {
      console.log(data);
    });

    return this.firestore.collection('evaluation').add(record);
  }

  read_Matieres() {
    return this.firestore.collection('Quizz').snapshotChanges();
  }

  update_Matiere(recordID, record) {
    return this.firestore.doc('Quizz/' + recordID).update(record);
  }

  delete_Matiere(record_id) {
    return this.firestore.doc('Quizz/' + record_id).delete();
  }
}
