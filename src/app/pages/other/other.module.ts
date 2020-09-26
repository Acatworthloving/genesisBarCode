import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {OtherRoutingModule} from './other-routing.module';

import {OtherPage} from './other.page';
import {ReceivingPage} from './receiving/receiving.page';
import {DeliverPage} from './deliver/deliver.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OtherRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [OtherPage, ReceivingPage, DeliverPage]
})
export class OtherModule {
}
