import { Component, OnInit } from '@angular/core';

import { Project } from '../project.model';

import { projectData } from '../projectdata';
import { MatiereService } from '../../../core/services/matiere.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-projectgrid',
  templateUrl: './projectgrid.component.html',
  styleUrls: ['./projectgrid.component.scss']
})

/**
 * Projects-grid component
 */
export class ProjectgridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  projectData: Project[];
matieres=[];
  constructor(private matiereService:MatiereService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Grid', active: true }];

    this.projectData = projectData;
    this.getMatiere();
  }
// lire les matiére de webservice matierservice dans le tableau matieres
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
