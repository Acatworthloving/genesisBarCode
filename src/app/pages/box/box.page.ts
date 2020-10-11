import { Component, OnInit } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
    selector: 'app-stock',
    templateUrl: './box.page.html',
})
export class BoxPage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
