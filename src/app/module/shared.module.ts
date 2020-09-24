import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TablePage} from '../pages/component/table/table.page';
import {ScanInputPage} from '../pages/component/scan-input/scan-input.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        TablePage,
        ScanInputPage
    ],
    declarations: [
        TablePage,
        ScanInputPage
    ],
    providers: [],
    entryComponents: []
})
export class SharedModule {
}
