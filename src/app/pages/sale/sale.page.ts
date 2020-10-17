import { Component, OnInit } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
    selector: 'app-stock',
    templateUrl: './sale.page.html',
})
export class SalePage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
