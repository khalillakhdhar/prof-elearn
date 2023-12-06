import { Component, OnInit } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';

import { tasks } from './data';

import { Task } from './kanabn.model';
import { TacheService } from '../../../core/services/tache.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kanbanboard',
  templateUrl: './kanbanboard.component.html',
  styleUrls: ['./kanbanboard.component.scss']
})

/**
 * Kanbanboard Component
 */
export class KanbanboardComponent implements OnInit {

  upcomingTasks: Task[];
  inprogressTasks: Task[];
  completedTasks: Task[];
taches:any;
tache:any={}
user=JSON.parse(localStorage.getItem('user'));
  // bread crumb items
  breadCrumbItems: Array<{}>;
  roomUrl="https://appcall.daily.co/Elearning"
  constructor( private tacheapi:TacheService) { }

  ngOnInit() {
    let us=localStorage.getItem('user');
    let uss=JSON.parse(us);
    this.breadCrumbItems = [{ label: 'Tasks' }, { label: 'Kanban Board', active: true }];
// init taches
    this.tacheapi.read_Taches().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id,
            ...c.payload.doc.data() as {} })
        )
      )
    ).subscribe(data => {
      this.taches = data;
      console.log("taches",this.taches);
     // localStorage.setItem('taches', JSON.stringify(taches));


    }
    );
    this._fetchData();
  }
// add tache
  addTache(){
    this.tacheapi.ajouterTache(this.tache);
    this.tache={};
  }
  isMeetingActive(start: string, end: string): boolean {
    const currentTime = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    // Check if the current time is between start and end times
    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * on dragging task
   * @param item item dragged
   * @param list list from item dragged
   */
  onDragged(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
  }

  /**
   * On task drop event
   */
  onDrop(event: DndDropEvent, filteredList?: any[], targetStatus?: string) {
    if (filteredList && event.dropEffect === 'move') {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = filteredList.length;
      }

      filteredList.splice(index, 0, event.data);
    }
  }

  private _fetchData() {
    // all tasks
    this.inprogressTasks = tasks.filter(t => t.status === 'inprogress');
    this.upcomingTasks = tasks.filter(t => t.status === 'upcoming');
    this.completedTasks = tasks.filter(t => t.status === 'completed');
  }
}
