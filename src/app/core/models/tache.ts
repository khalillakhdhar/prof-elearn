export class Tache {
  id:string;
  titre: string;
  type: 'urgent' | 'hebdomadaire' | 'reclamation' | 'régulier';
  date: Date;
  heureDebut: Date;
  heureFin: Date;
  agent: any;

  constructor(titre: string, type: 'urgent' | 'hebdomadaire' | 'reclamation' | 'régulier', date: Date, heureDebut: Date, heureFin: Date, agent: any = null) {
    this.titre = titre;
    this.type = type;
    this.date = date;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
    this.agent = agent;
  }
}
