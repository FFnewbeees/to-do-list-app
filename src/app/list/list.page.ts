import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  listItems: Array<Item> =[];

  constructor(private storage:StorageService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storage.readData('list')
    .then( (response:any) => {
      if( response ){
         this.listItems = JSON.parse(response);
      }
    })
    .catch( (error) => console.log(error) );
  }
  

}
