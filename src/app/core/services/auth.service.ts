import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';
import { UsersService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor( private userService: UsersService) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return getFirebaseBackend().loginUser(email, password).then((response: any) => {
            const user = response;
            this.readme(email);
            return user;
        });
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(us:any) {

      return getFirebaseBackend().registerUser(us.email, us.password).then((response: any) => {


          us.grade="user";
          us.id=response.uid;
        let uss=Object.assign({}, us);
        console.log(uss);
        this.userService.create_NewUser(uss);
        //localStorage.setItem('user', JSON.stringify(uss));
        this.readme(uss.email);
            const user = response;
            return user;
        });
    }
    readme(email): void {
      console.log("email",email);
      this.userService.read_current(email).pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id,
              ...c.payload.doc.data() as {} })
          )
        )
      ).subscribe(data => {
        let me = data[0];
        //this.user=this.actual;
        localStorage.setItem('user', JSON.stringify(me));

        //console.clear();
        console.log("myuser",me);
        localStorage.setItem('user', JSON.stringify(me));



      }
      );
    }
    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        getFirebaseBackend().logout();
    }
}

