import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { Tache } from '../models/tache';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private tacheCollection: AngularFirestoreCollection<Tache>;
  taches: Observable<Tache[]>;

constructor(private afs: AngularFirestore, private firestore: AngularFirestore) {
  this.tacheCollection = this.afs.collection<Tache>('Taches');
  this.taches = this.tacheCollection.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Tache;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}

read_Taches() {
  return this.firestore.collection('Taches').snapshotChanges();

}
getTachesData(): Observable<any[]> {
  return this.taches.pipe(
    map(taches => taches.map(tache => ({
      id: tache.id,
      title: tache.titre,
      start: tache.heureDebut,
      end: tache.heureFin, // ou tache.heureFin.toDate() selon vos besoins
      className: 'bg-warning text-white'
    })))
  );
}


  ajouterTache(tache: Tache) {
    return this.tacheCollection.add(tache);
  }

  supprimerTache(tacheId: string) {
    return this.tacheCollection.doc(tacheId).delete();
  }

  mettreAJourTache(tacheId: string, tache: Tache) {
    return this.tacheCollection.doc(tacheId).update(tache);
  }
}
