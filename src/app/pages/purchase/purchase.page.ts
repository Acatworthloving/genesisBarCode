import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'app-purchase',
    templateUrl: './purchase.page.html',
})
export class PurchasePage implements OnInit {
    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

}
