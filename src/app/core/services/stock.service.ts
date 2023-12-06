import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Produit } from '../models/produit';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  url="http://localhost:8080/cours"

  constructor(
    private firestore: AngularFirestore,
    // http service
    private http: HttpClient,
  ) { }


  create_NewStock(record) {
    let produit=new Produit();
    produit.client=record.client;
    produit.titre=record.titre;
    produit.description=record.description;
    produit.client=record.client;
    produit.photo=record.photo;

    this.http.post<Produit>(this.url, produit).subscribe(data=>{
      console.log(data);
     });

    return this.firestore.collection('/Stocks').add(record);
  }

  read_Stocks() {

    return this.firestore.collection('/Stocks').snapshotChanges();

  }

  update_Stock(recordID, record) {
    this.firestore.doc('/Stocks/' + recordID).update(record);
    console.log('updated');
  }

  delete_Stock(record_id) {
    this.firestore.doc('/Stocks' + record_id).delete();
  }
}
