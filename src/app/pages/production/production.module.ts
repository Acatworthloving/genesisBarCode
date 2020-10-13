import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProductionRoutingModule} from './production-routing.module';

import {ProductionPage} from './production.page';
import {UpPage} from './up/up.page';
import {DownPage} from './down/down.page';
import {CompletionPage} from './completion/completion.page';
import {SharedModule} from '../../module/shared.module';
import {FinishingPage} from './finishing/finishing.page';
import {PickingPage} from './picking/picking.page';
import {ReturnPage} from './return/return.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductionRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [ProductionPage, UpPage, DownPage, CompletionPage, FinishingPage, ReturnPage, PickingPage]
})
export class ProductionModule {
}
