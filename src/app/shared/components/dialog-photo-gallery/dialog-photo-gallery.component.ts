import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-photo-gallery',
  templateUrl: './dialog-photo-gallery.component.html',
  styleUrls: ['./dialog-photo-gallery.component.css'],
})
export class DialogPhotoGalleryComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: '') {}
  slides = [
    {
      image:
        'https://i.ibb.co/xjjt4Tb/1633640000-555805-1633640051-noticia-normal-recorte1.jpg',
    },
    { image: 'https://i.ibb.co/pPB8wZr/335192.jpg' },
    { image: 'https://i.ibb.co/NyycVKj/335101.jpg' },
    { image: 'https://i.ibb.co/KLZsyPK/335089.jpg' },
    { image: 'https://i.ibb.co/8NrTJ5M/c3306322cc33a3d8e5e4e01c48f689d8.jpg' },
  ];

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  ngOnInit(): void {}

  open() {}
}

// import {Component, Inject} from '@angular/core';
// import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

// export interface DialogData {
//   animal: 'panda' | 'unicorn' | 'lion';
// }

// /**
//  * @title Injecting data when opening a dialog
//  */
// @Component({
//   selector: 'dialog-data-example',
//   templateUrl: 'dialog-data-example.html',
// })
// export class DialogDataExample {
//   constructor(public dialog: MatDialog) {}

//   openDialog() {
//     this.dialog.open(DialogDataExampleDialog, {
//       data: {
//         animal: 'panda'
//       }
//     });
//   }
// }

// @Component({
//   selector: 'dialog-data-example-dialog',
//   templateUrl: 'dialog-data-example-dialog.html',
// })
// export class DialogDataExampleDialog {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
// }
