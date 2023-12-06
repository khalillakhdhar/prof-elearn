import { Enseignant } from './enseignant';
import { Matiere } from './matiere';
export class Cours {
  id:string;
  titre:string;
  url:string;
  description:string;
  matiere:Matiere;
  enseignant:Enseignant;

}
