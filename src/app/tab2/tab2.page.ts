import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  input:string;
  listItems: Array<Item> =[];

  constructor(private storage:StorageService) { }

  ngOnInit (){
  }

  // ionViewDidEnter(){
  //   this.storage.readData('list')
  //   .then( (response:any) => {
  //     if( response ){
  //       this.listItems = JSON.parse(response);
  //     }
  //   })
  //   .catch( (error) => console.log(error) );
  // }

  addListItem( taskName:string){
    this.input ='';
    let item = {taskName: taskName, id: new Date().getTime(), status: false};
    this.listItems.push( item );
    this.saveList();

  }

  saveList(){
    this.storage.saveData('list', this.listItems)
    .then((response) =>{
      //data written successfully
      console.log(this.listItems);
      
    })
    .catch((error) =>{
      console.log(error);
    })
  }
  
  deleteItem(id:number){
    this.listItems.forEach( (Item, index ) => {
      if( Item.id == id ){
        this.listItems.splice( index, 1 );
      }
    });
    this.saveList();
  }

  changeItemStatus(id:number){
    this.listItems.forEach( (item) => {
      if( item.id == id){
        item.status = ( item.status == false )? true : false;
        
      }
    } );
    this.saveList();
  }
}
