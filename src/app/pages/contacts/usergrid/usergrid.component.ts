import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/storage';

import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Usergrid } from './usergrid.model';

import { userGridData } from './data';
import { UsersService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-usergrid',
  templateUrl: './usergrid.component.html',
  styleUrls: ['./usergrid.component.scss']
})

/**
 * Contacts user grid component
 */
export class UsergridComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  chemin="../../task/list";
user:User;
users?:User[];
  userGridData: Usergrid[];
  selected;
  downloadURL: Observable<string>;
  selectedFile: File = null;
  userForm: FormGroup;
  fb = "";
  public query: any = '';
p: number = 1;

  prcentage: number;
pass:string;
  percentage: Observable<number>;
  items: FormArray;
  selectValue: string[];
  submitted = false;

  constructor(private authenticationService: AuthenticationService,private storage: AngularFireStorage,private modalService: NgbModal, private formBuilder: FormBuilder,private userService:UsersService) { }

  ngOnInit() {
    this.readagents();
    this.selectValue = ['admin', 'enseignant'];
this.user=new User();
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users Grid', active: true }];
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      password: ['', [Validators.required]],
      tel: ['', [Validators.required]],

    });
    /**
     * fetches data
     */
    this._fetchData();
  }
  readagents(): void {
    this.userService.read_Users().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.users = data;
      console.log("users",this.users);

      localStorage.setItem("nbagents",this.users.length.toString());

    }
    );
  }

  get form() {
    return this.userForm.controls;
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
              this.user.photo=this.fb;

            }
            console.log(this.fb);
            this.user.photo=this.fb;

          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
          this.user.photo=this.fb;
        }
      });

  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content);
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.userGridData = userGridData;
  }

  /**
   * Save user
   */
   saveUser() {
    if (this.userForm.valid) {

      this.user.nom= this.userForm.get('name').value;
      this.user.adresse= this.userForm.get('adresse').value;
      this.user.email= this.userForm.get('email').value;
      this.user.tel= this.userForm.get('tel').value;
      this.user.grade= this.selected;
      this.user.password=this.userForm.get('password').value;
      let us=Object.assign({},this.user);
      this.userService.create_NewUser(us);
      this.authenticationService.register(this.user);
       this.modalService.dismissAll()
    }
    this.submitted = true;
    this.userForm.reset();
  }
  delete(id)
  {
    if(confirm("vous voulez supprimez?!"))
    this.userService.delete_User(id);
  }
}
