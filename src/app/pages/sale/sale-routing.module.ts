import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalePage } from './sale.page';
import { OutPage } from './out/out.page';
import { ReturnPage } from './return/return.page';

const routes: Routes = [
  {
    path: '',
    component: SalePage
  },
  {
    path: 'out/:id',
    component: OutPage
  },
  {
    path: 'return/:id',
    component: ReturnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleRoutingModule {}
