import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Item } from '../../models/item.model';
import { AlertController} from '@ionic/angular';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  listItems: Array<Item> =[];
  listDeletedItems: Array<Item> =[];
  input:string;
  dateInput:string;
  today:string;

  constructor(
    private storage:StorageService, 
    private alertController:AlertController,
    private localNotifications:LocalNotifications ) { }

  ngOnInit() {
    this.ionViewDidEnter();
 
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
  
  addListItem( taskName:string, dateInput:string ){
    this.input ='';
    this.dateInput="";
    let item = {taskName: taskName, id: new Date().getTime(), status: false, dueDate: dateInput.slice(0,10) };
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

  saveDeleteItem(id:number, taskName:string){

    let deleteItem = {taskName: taskName, id:id, status: true, dueDate: this.getFinishDate() };
    this.listDeletedItems.push(deleteItem);
    this.saveDeleteList();
  }

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

  getFinishDate(){
    var temp = new Date();
    var dd = String(temp.getDate()).padStart(2, '0');
    var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = temp.getFullYear();

    return this.today = yyyy + '/' + mm + '/' + dd;
  }

  async openReminderDialog(text:string){
    const alert = await this.alertController.create({
      header:'Reminder',
      subHeader: 'Snooze',
      message: 'You will be reminded in 60 minutes',
      buttons:[
        {
          text:'Cancel',
          handler:(event) => {
            //cancel the reminder
          }
        },
        {
          text:'Confirm',
          role:'cancel',
          handler:(event) => {
          this.scheduleReminder(5000,text)
          }
        }
      ]
    });
    await alert.present();
  }

  scheduleReminder( time:number, text:string ){
    this.localNotifications.schedule({
      text:`A Reminder to ${text}`,
      trigger: {at: new Date(new Date().getTime() + time)},
      led:'000000',
      sound:null
    });
  }
  
}
