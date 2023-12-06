
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
// import http
// import http client

import { HttpClient } from '@angular/common/http';
// import observable
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map, catchError } from 'rxjs/operators';
// import todo model
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userCollection: AngularFirestoreCollection<User>;

url="http://localhost:8080/user"
  constructor(
    private firestore: AngularFirestore,
    // http service
    private http: HttpClient,
  ) { 
    this.userCollection = this.firestore.collection<User>('Users');

  }


  create_NewUser(record) {
// send the new user to this.url post request
//
let user = new User();
user.nom=record.nom;
user.prenom=record.prenom;
user.email=record.email;
user.password=record.password;
user.grade="user";
user.tel=record.tel;
user.photo="none"
 this.http.post<User>(this.url, user).subscribe(data=>{
  console.log(data);
 });

    return this.firestore.collection('Users').add(record).then(
      ()=>{
        console.log("firebase created")
      }
    );
  }

  read_Users() {
    return this.firestore.collection('Users').snapshotChanges();
  }
  read_clients() {
    return this.firestore.collection("Users", (ref) => ref.where("grade", "==", "user"))
    .snapshotChanges();
  }
  read_admins() {
    return this.firestore.collection("Users", (ref) => ref.where("grade", "==", "admin"))
    .snapshotChanges();
  }
  read_current(email: string): Observable<any> {
    console.log("getting", email);
    return this.firestore.collection("Users", (ref) => ref.where("email", "==", email))
  .snapshotChanges();

  }

  read_effectifs() {
    return this.firestore.collection("Users", (ref) => ref.where("grade", "!=", "client"))
    .snapshotChanges();
  }
  update_User(recordID, record) {
  /*  const documentRef = this.firestore.collection('Users').doc(recordID);
    return documentRef.update(record).then(()=>
{    console.log('updated');}

    );
    */
    const collectionRef = this.firestore.collection("Users", ref => ref.where('id', '==', recordID));

    return collectionRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot.size === 1) {
        const documentRef = querySnapshot.docs[0].ref;
        return documentRef.update(record);
      } else {
        throw new Error('Document not found or multiple documents found with the provided email.');
      }
    });
  }


  delete_User(record_id) {
    this.firestore.doc('Users/' + record_id).delete();
  }
}
