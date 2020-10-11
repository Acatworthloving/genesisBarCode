import { Component, OnInit } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
    selector: 'app-other',
    templateUrl: './other.page.html',
})
export class OtherPage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
