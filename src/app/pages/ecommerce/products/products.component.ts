import { Component, OnInit } from '@angular/core';
import { productModel, productList } from '../product.model';
import { Options } from 'ng5-slider';
import { HttpClient } from '@angular/common/http';
import { Produit } from '../../../core/models/produit';
import { StocksService } from '../../../core/services/stock.service';
import { Observable } from 'rxjs';
import { map, finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';

import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/models/user';
import { UsersService } from 'src/app/core/services/user.service';
import { MatiereService } from 'src/app/core/services/matiere.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

/**
 * Ecommerce products component
 */

export class ProductsComponent implements OnInit {
produit:Produit;
produits:Produit[];
selected;
fb = "";
query="";
id:string;
sub;
nom="";

grade:string;
email:string;
downloadURL: Observable<string>;
selectedFile: File = null;
percentage: Observable<number>;
    prcentage: number;
  breadCrumbItems: Array<{}>;
  pricevalue = 100;
  minVal = 100;
  maxVal = 500;
  ph="";
  clients:User[];
  priceoption: Options = {
    floor: 0,
    ceil: 800,
    translate: (value: number): string => {
      return '$' + value;
    },
  };
  log = '';
  matieres=[];
  discountRates: number[] = [];
  public products: productModel[] = [];
  public productTemp: productModel[] = [];
  public search: any = '';
  user=JSON.parse(localStorage.getItem('user'));
  constructor(private matiereService:MatiereService,private storage: AngularFireStorage,private http: HttpClient,private userapi:UsersService,private proapi:StocksService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.getMatiere();
    this.produit=new Produit();
    let us=localStorage.getItem('user');
    let uss=JSON.parse(us);
    this.produit.client=uss.nom+" "+uss.prenom;

    this.breadCrumbItems = [{ label: 'Gestion' }, { label: 'Application', active: true }];
    this.products = Object.assign([], productList);
    this.nom="";
    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.email = params['email'];
      this.nom = params['nom'];
      this.grade = params['gr'];
     // console.log("id",this.id);

      if(params['nom']!=null)
      {this.search=this.nom;
       // this.search?.setAttribute('disabled', '');

      }
      else
      {
        this.nom="";
        this.search="";
      }
     /* localStorage.setItem("userid",this.id);
      localStorage.setItem("email",this.email);
      localStorage.setItem("grade",this.grade);
      localStorage.setItem("nom",this.nom);
      */
  });
this.read();
    // this.http.get<any>(`http://localhost:8000/api/products`)
    //   .subscribe((response) => {
    //     this.products = response.data;
    //   });
    this.readclients();

  }
  getMatiere()
  {
    this.matiereService.read_Matieres().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.matieres = data;
      console.log("matieres",this.matieres);


    }
    );
  }
detectstock(stk):string
{
  let st=parseFloat(stk);
  if(st<=0)
return "épuisé"
else if(st<=3)
return "faible"
else
return "disponible"

}
  searchFilter(e) {
    const searchStr = e.target.value;
    this.products = productList.filter((product) => {
      return product.name.toLowerCase().search(searchStr.toLowerCase()) !== -1;
    });
  }
  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `/Profiles/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`/Profiles/${n}`, file);
    this.percentage = task.percentageChanges();
    this.percentage.subscribe(prcentage => {
      this.prcentage = Math.round(prcentage);
    },
    error => {
      console.log(error);
    })
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            if (url) {
              this.fb = url;
              this.produit.photo=this.fb;

            }
            console.log(this.fb);
            this.produit.photo=this.fb;

          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
          this.produit.photo=this.fb;
        }
      });

  }
  discountLessFilter(e, percentage) {
    if (e.target.checked && this.discountRates.length === 0) {
      this.products = productList.filter((product) => {
        return product.discount < percentage;
      });
    }
    else {
      this.products = productList.filter((product) => {
        return product.discount >= Math.max.apply(null, this);
      }, this.discountRates);
    }
  }



  discountMoreFilter(e, percentage: number) {
    if (e.target.checked) {
      this.discountRates.push(percentage);
    } else {
      this.discountRates.splice(this.discountRates.indexOf(percentage), 1);
    }
    this.products = productList.filter((product) => {
      return product.discount >= Math.max.apply(null, this);
    }, this.discountRates);
  }

  valueChange(value: number, boundary: boolean): void {
    if (boundary) {
      this.minVal = value;
    } else {
      this.maxVal = value;
      this.products = productList.filter(function (product) {
        return product.disRate <= value && product.disRate >= this;
      }, this.minVal);
    }
  }
  read(): void {
    this.proapi.read_Stocks().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.produits = data;
      console.log("produits",this.produits);


    }
    );
  }
 async addproduit()
  {
    let prod=Object.assign({},this.produit);
    Promise.resolve(this.proapi.create_NewStock(prod));
    console.log("added");
    this.produit=new Produit();
    this.ph="";
    this.percentage=null;
    this.prcentage=null;
  //  await(location.reload());
  }
  readclients(): void {
    this.userapi.read_clients().pipe(
      map((changes:any) =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.clients = data;
      console.log("clients",this.clients);


    }
    );
  }
}
