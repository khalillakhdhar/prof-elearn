import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
  ) { }
user=new User();
  ngOnInit() {
   //
  }

  // convenience getter for easy access to form fields
 // get f() { return this.signupForm.controls;
  //}

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
//console.log('onSubmit',this.f);

    // stop here if form is invalid

      //console.log('email',email)
      if (environment.defaultauth === 'firebase') {
        //email: string, password: string,tel:string,adresse:string,nom:string,prenom:string
        this.authenticationService.register(this.user).then((res: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/dashboard']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      }

  }
}
