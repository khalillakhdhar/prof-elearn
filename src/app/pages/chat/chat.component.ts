import { AfterViewInit, Component, OnInit, Pipe, ViewChild, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { of, combineLatest } from 'rxjs';

import { ChatUser, ChatMessage } from './chat.model';
import { AngularFireStorage } from '@angular/fire/storage';

import { chatData, chatMessagesData } from './data';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, merge } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { map, finalize } from "rxjs/operators";
import { User } from 'src/app/core/models/user';
import { UsersService } from '../../core/services/user.service';
import { MessagerieService } from '../../core/services/messagerie.service';

@Component({
  selector: 'app-chat',

  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;

  username = 'Steven Franklin';

  // bread crumb items
  breadCrumbItems: Array<{}>;
  user:User;
  users?:User[];
    selected;
    downloadURL: Observable<string>;
    selectedFile: File = null;
    userForm: FormGroup;
    fb = "";
    innersearch: any = '';
    public query: any = '';
  p: number = 1;
msg:any ={};
    prcentage: number;
  pass:string;
    percentage: Observable<number>;
    items: FormArray;
    selectValue: string[];
    submitted = false;
  chatData: ChatUser[];
  chatMessagesData: ChatMessage[];

  formData: FormGroup;

  // Form submit
  chatSubmit: boolean;
id:string;
sub;
nom:string;
  usermessage: string;
messages:any=[];
  constructor(private storage: AngularFireStorage,private userService:UsersService,private messagesService:MessagerieService,public formBuilder: FormBuilder,private route : ActivatedRoute) {
  }

  ngOnInit() {
this.msg={};

    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.nom = params['nom'];
      this.username=this.nom;
      console.log("id",this.id);
      localStorage.setItem("usid",this.id);
      this.readmessages(this.id,JSON.parse(localStorage.getItem("mydata")));
      this.breadCrumbItems = [{ label: this.nom }, { label: 'Chat', active: true }];
  });

this.readusers();
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.onListScroll();

  //  this._fetchData();
  }

  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }
  readusers(): void {
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


    }
    );
  }
  readmessages(id: string, myid: string): void {
    this.messagesService.read_myMessages().subscribe(
      (messages: any[]) => {
        // Handle the merged messages here
        console.log("messages",messages);

        this.messages = messages.filter((m) =>
          m.recieverid === localStorage.getItem("myid") && m.senderid === localStorage.getItem("usid") || m.recieverid === localStorage.getItem("usid") && m.senderid === localStorage.getItem("myid")
        );

        console.log("msgs", this.messages);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }


  private _fetchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }

  chatUsername(name) {
    this.username = name;
    this.usermessage = 'Hello';
    this.chatMessagesData = [];
    const currentDate = new Date();

    this.chatMessagesData.push({
      name: this.username,
      message: this.usermessage,
      time: currentDate.getHours() + ':' + currentDate.getMinutes()
    });

  }

  /**
   * Save the message in chat
   */
  messageSave(type) {
    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.nom = params['nom'];
      this.username=this.nom;
      console.log("id",this.id);
      const message = this.formData.get('message').value;
      const currentDate = Date.now();
      this.msg.date=currentDate;
      let us=JSON.parse(localStorage.getItem("user"));
      this.msg.senderUsername=us.nom+' '+us.prenom;
      this.msg.senderid=localStorage.getItem("myid");

      if (this.formData.valid && message) {
        this.msg.texte=message;
        this.msg.type=type;
        this.msg.recieverUsername=this.username;
        this.msg.recieverid=this.id;
let ms=Object.assign({},this.msg);
this.messagesService.create_NewMessage(ms);

        this.onListScroll();

        // Set Form Data Reset
        this.formData = this.formBuilder.group({
          message: null
        });
      }

      this.chatSubmit = true;  });

  }

}
