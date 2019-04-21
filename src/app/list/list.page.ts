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
  listDeletedItems: Array<Item> =[];
  input:string;

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
  
  deleteItem(id:number, taskName:string){
    this.saveDeleteItem(id,taskName);
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

  taskRemaining():number{
    return this.listItems.filter(item => !item.status).length;
  }

  // atLeastOneTaskCompleted():boolean{
  //   return this.listItems.filter(item => item.status).length > 0;
  // }

  // clearCompletedTask(id:number){
  //   this.saveDeleteItem(id;)
  //   this.listItems = this.listItems.filter(item => !item.status);
  //   this.saveList();
  // }

  saveDeleteItem(id:number, taskName:string){
    let deleteItem = {taskName: taskName, id:id, status: true };
    this.listDeletedItems.push(deleteItem);
    this.saveDeleteList();
  }

  // saveDeleteItem(id:number){
  //   this.listItems.forEach((Item) => {
  //     if(Item.id = id){
  //       let deleteItem = {taskName:Item.taskName, id:Item.id, status:true};
  //       this.listDeletedItems.push(deleteItem);
  //     }
  //   });
  //   this.saveDeleteList();
  // }

  saveDeleteList(){
    this.storage.saveData('deleteList', this.listDeletedItems)
    .then((response) =>{
      //data written successfully
      console.log(this.listDeletedItems);
      
    })
    .catch((error) =>{
      console.log(error);
    })
  }
}
