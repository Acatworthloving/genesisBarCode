import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TablePage} from '../pages/component/table/table.page';
import {TableEditPage} from '../pages/component/table-edit/table-edit.page';
import {TableKcPage} from '../pages/component/table-kc/table-kc.page';
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
        MaterielItemPage,
        TableEditPage,
        TableKcPage
    ],
    declarations: [
        TablePage,
        ScanInputPage,
        MaterielItemPage,
        TableEditPage,
        TableKcPage
    ],
    providers: [],
    entryComponents: []
})
export class SharedModule {
}
