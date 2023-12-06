import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MessagerieService {
  private messagesCollection: AngularFirestoreCollection<any>;

  constructor(
    private firestore: AngularFirestore
  ) {
    this.messagesCollection = this.firestore.collection<any>('Messages');

  }


  create_NewMessage(record) {
    let id=localStorage.getItem("myid");
    return this.firestore.collection("/Messages").add(record);
  }
  getMessagesBetweenUsers(senderId: string, receiverId: string) {
    return this.messagesCollection.ref
      .where('senderid', '==', senderId)
      .where('recieverid', '==', receiverId)
      .get()
      .then(snapshot => {
        const messages = [];
        snapshot.forEach(doc => {
          messages.push(doc.data());
        });
        return messages;
      });
  }

read_Messages(userId: string) {
  const currentUser =JSON.parse(localStorage.getItem("mydata"));
  console.log("userid",currentUser.id)
  const emetteurQuery = this.firestore.collection("/Messages", ref =>
    ref.where("senderid", "==", userId)
    .where("recieverid", "==", currentUser.id)
       .orderBy('date')
  ).snapshotChanges();

  const recepteurQuery = this.firestore.collection("/Messages", ref =>
    ref.where("recieverid", "==", userId)
    .where("senderid", "==", currentUser.id)
       .orderBy('date')
  ).snapshotChanges();

  return forkJoin([emetteurQuery, recepteurQuery]).pipe(
    map(results => {
      const mergedResults = results.reduce((acc, curr) => acc.concat(curr));
      return mergedResults;
    })
  );
}


read_myMessages() {
  return this.firestore.collection("Messages").snapshotChanges().pipe(
    map(snapshot => {
      return snapshot.map(doc => doc.payload.doc.data());
    })
  );
}
  read_hisMessages() {
    return this.firestore.collection("Messages", (ref) => ref.where("recepteur.id", "==", localStorage.getItem("usid")))
    .snapshotChanges();
  }
  delete_Message(record_id) {

    this.firestore.doc('Messages/' + record_id).delete();
  }
}
