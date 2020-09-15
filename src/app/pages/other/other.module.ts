import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {OtherRoutingModule} from './other-routing.module';

import {OtherPage} from './other.page';
import {ReceivingPage} from './receiving/receiving.page';
import {DeliverPage} from './deliver/deliver.page';
import {TablePage} from '../component/table/table.page';
import {ScanInputPage} from '../component/scan-input/scan-input.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OtherRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [OtherPage, ReceivingPage, DeliverPage, TablePage, ScanInputPage]
})
export class OtherModule {
}
