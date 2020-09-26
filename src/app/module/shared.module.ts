import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TablePage} from '../pages/component/table/table.page';
import {ScanInputPage} from '../pages/component/scan-input/scan-input.page';
import {MaterielItemPage} from '../pages/component/materiel-item/materiel-item.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        TablePage,
        ScanInputPage,
        MaterielItemPage
    ],
    declarations: [
        TablePage,
        ScanInputPage,
        MaterielItemPage
    ],
    providers: [],
    entryComponents: []
})
export class SharedModule {
}
