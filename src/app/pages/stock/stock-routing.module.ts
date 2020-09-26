import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockPage } from './stock.page';
import { DumpRequestPage } from './dump-request/dump-request.page';
import { TransferOrderPage } from './transfer-order/transfer-order.page';

const routes: Routes = [
  {
    path: '',
    component: StockPage
  },
  {
    path: 'dump-request/:id',
    component: DumpRequestPage
  },
  {
    path: 'transfer-order/:id',
    component: TransferOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule {}
