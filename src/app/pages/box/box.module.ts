import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {BoxRoutingModule} from './box-routing.module';

import {BoxPage} from './box.page';
import {IntoBoxPage} from './into-box/into-box.page';
import {UnpackingPage} from './unpacking/unpacking.page';
import {BundlingCardPage} from './bundling-card/bundling-card.page';
import {UnbundlingPage} from './unbundling/unbundling.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BoxRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [BoxPage, IntoBoxPage, UnpackingPage, BundlingCardPage, UnbundlingPage]
})
export class BoxModule {
}
