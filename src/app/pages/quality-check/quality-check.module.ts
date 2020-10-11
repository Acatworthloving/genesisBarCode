import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {QualityCheckRoutingModule} from './quality-check-routing.module';

import {QualityCheckPage} from './quality-check.page';
import {IncomingPage} from './incoming/incoming.page';
import {IncomingQualityPage} from './incoming-quality/incoming-quality.page';
import {ProduceQualityPage} from './produce-quality/produce-quality.page';
import {StockQualityPage} from './stock-quality/stock-quality.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        QualityCheckRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [QualityCheckPage, IncomingPage, IncomingQualityPage, ProduceQualityPage, StockQualityPage]
})
export class QualityCheckModule {
}
