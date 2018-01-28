import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";

@Component({
  selector: 'page-leitura',
  templateUrl: 'leitura.html'
})
export class LeituraPage {

  item : any;

  listaItems = [];

  loading: any;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private bluetoothSerial: BluetoothSerial,
              private loadingCtrl: LoadingController) {

    this.item = this.navParams.get("item");

  }

  read(event){

    this.loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    this.loading.present();

    this.bluetoothSerial.read().then((data) => {

      this.listaItems = this.listaItems.concat([{codigo: data}]);

      this.loading.dismissAll();

    }, (error) => {

      console.log(error)

      this.loading.dismissAll();

    })
  }

}
