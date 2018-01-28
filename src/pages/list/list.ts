import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";
import {BLE} from "@ionic-native/ble";
import {LeituraPage} from "../leitura/leitura";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  listaConectados = [];

  listaNaoConectados = [];

  loading: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private bluetoothSerial: BluetoothSerial,
              private platform: Platform,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

    this.verificaDispositivo();

    this.loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

  }

  async verificaDispositivo(){

    await this.bluetoothSerial.isEnabled().catch(() => this.bluetoothSerial.enable());

  }

  async listarDispositivos(){

    this.loading.present();

    this.listaConectados = [];

    this.listaNaoConectados = [];

    this.listaConectados = await this.bluetoothSerial.list().catch((err) => this.fail(err));

    this.listaNaoConectados = await this.bluetoothSerial.discoverUnpaired().catch((err) => this.fail(err));

    this.loading.dismissAll();
  }

  conectar(event, item){

    let alert = this.alertCtrl.create({
      title: 'Conectar',
      message: 'Tem certeza que deseja parear com o dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Conectar',
          handler: () => {

            this.bluetoothSerial.connectInsecure(item.address).subscribe((dataOK) => {

              this.navCtrl.push(LeituraPage, {item: item})

            }, this.fail);

          }
        }
      ]
    });

    alert.present();

  }

  desconectar(item) {

    let alert = this.alertCtrl.create({
      title: 'Desconectar?',
      message: 'Quer desconectar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Desconectar',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });

    alert.present();
  }

  success = (data) => alert(data);

  fail = (error) => alert(error);


}
