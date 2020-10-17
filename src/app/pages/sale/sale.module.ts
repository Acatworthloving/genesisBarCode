import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SaleRoutingModule} from './sale-routing.module';

import {SalePage} from './sale.page';
import { OutPage } from './out/out.page';
import { ReturnPage } from './return/return.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SaleRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [SalePage, OutPage, ReturnPage]
})
export class SaleModule {
}
