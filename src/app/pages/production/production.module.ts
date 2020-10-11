import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProductionRoutingModule} from './production-routing.module';

import {ProductionPage} from './production.page';
import {UpPage} from './up/up.page';
import {DownPage} from './down/down.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductionRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [ProductionPage, UpPage, DownPage]
})
export class ProductionModule {
}
