import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WarningRoutingModule} from './warning-routing.module';

import {WarningPage} from './warning.page';
import { AlarmPage } from './alarm/alarm.page';
import { DisarmedPage } from './disarmed/disarmed.page';
import {SharedModule} from '../../module/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WarningRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [WarningPage, AlarmPage, DisarmedPage]
})
export class WarningModule {
}
