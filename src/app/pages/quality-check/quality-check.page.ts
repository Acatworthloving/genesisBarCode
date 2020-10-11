import { Component, OnInit } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
    selector: 'app-quality-check',
    templateUrl: './quality-check.page.html',
})
export class QualityCheckPage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
