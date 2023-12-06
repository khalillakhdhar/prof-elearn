import { User } from './user';
export class Messagerie {
  id?:string;
  texte?:string;
  emetteur:User;
  recepteur:User;
  date=Date.now();

}
