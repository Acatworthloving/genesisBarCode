import { Component, OnInit } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
    selector: 'app-stock',
    templateUrl: './warning.page.html',
})
export class WarningPage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
