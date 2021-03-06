import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {StockRoutingModule} from './stock-routing.module';

import {StockPage} from './stock.page';
import {DumpRequestPage} from './dump-request/dump-request.page';
import {TransferOrderPage} from './transfer-order/transfer-order.page';
import {SharedModule} from '../../module/shared.module';
import {QueryPage} from './query/query.page';
import {InventoryPage} from './Inventory/Inventory.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StockRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [StockPage, DumpRequestPage, TransferOrderPage, QueryPage, InventoryPage]
})
export class StockModule {
}
