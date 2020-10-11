import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PurchaseRoutingModule} from './purchase-routing.module';

import {PurchasePage} from './purchase.page';
import {QualityReceivingPage} from './quality-receiving/quality-receiving.page';
import {ReceivingPage} from './receiving/receiving.page';
import {ReturnGoodsPage} from './return-goods/return-goods.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PurchaseRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [PurchasePage, QualityReceivingPage, ReceivingPage, ReturnGoodsPage]
})
export class PurchaseModule {
}
