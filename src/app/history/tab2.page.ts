import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  listItems: Array<Item> =[];

  constructor(private storage:StorageService) { }

  ngOnInit (){
    this.ionViewDidEnter();
  }

  ionViewDidEnter(){
    this.storage.readData('deleteList')
    .then( (response:any) => {
      if( response ){
        this.listItems = JSON.parse(response);
      }
    })
    .catch( (error) => console.log(error) );
  }

}
