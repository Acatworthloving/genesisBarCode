import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductionPage} from './production.page';
import {UpPage} from './up/up.page';
import {DownPage} from './down/down.page';
import {CompletionPage} from './completion/completion.page';
import {FinishingPage} from './finishing/finishing.page';
import {ReturnPage} from './return/return.page';
import {PickingPage} from './picking/picking.page';

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
    },
    {
        path: 'completion/:id',
        component: CompletionPage
    },
    {
        path: 'finishing/:id',
        component: FinishingPage
    },
    {
        path: 'return/:id',
        component: ReturnPage
    },
    {
        path: 'picking/:id',
        component: PickingPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductionRoutingModule {
}
