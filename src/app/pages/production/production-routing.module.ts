import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductionPage} from './production.page';
import {UpPage} from './up/up.page';
import {DownPage} from './down/down.page';

const routes: Routes = [
    {
        path: '',
        component: ProductionPage
    },
    {
        path: 'up/:id',
        component: UpPage
    },
    {
        path: 'down/:id',
        component: DownPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductionRoutingModule {
}
