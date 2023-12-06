import { Component, OnInit } from '@angular/core';

import { Project } from '../project.model';

import { projectData } from '../projectdata';
import { MatiereService } from 'src/app/core/services/matiere.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})

/**
 * Projects-list component
 */
export class ProjectlistComponent implements OnInit {
  matieres:any;

 // bread crumb items
 breadCrumbItems: Array<{}>;
img="../../../../assets/images/companies/img-1.png"
 projectData: Project[];

 constructor(private matiereService:MatiereService) { }
 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Quizz' }, { label: ' List', active: true }];

   this.projectData = projectData;
   this.getMatiere();
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

}
