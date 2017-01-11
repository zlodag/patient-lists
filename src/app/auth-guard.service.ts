import { Injectable }     from '@angular/core';
import { CanActivateChild }    from '@angular/router';
import { AngularFireAuth } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(
      private auth: AngularFireAuth
  ) {
      this.authStatus = this.auth.map(user => {
          console.log(user);
          return user !== null;
      });
  }

  canActivateChild() {
      return this.authStatus;
  }

  private authStatus: Observable<boolean>;
}
