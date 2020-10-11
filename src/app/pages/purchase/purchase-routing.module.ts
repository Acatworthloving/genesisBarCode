import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasePage } from './purchase.page';
import { QualityReceivingPage } from './quality-receiving/quality-receiving.page';
import { ReceivingPage } from './receiving/receiving.page';
import { ReturnGoodsPage } from './return-goods/return-goods.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasePage,
  },
  {
    path: 'quality-receiving/:id',
    component: QualityReceivingPage,
  },
  {
    path: 'receiving/:id',
    component: ReceivingPage,
  },
  {
    path: 'return-goods/:id',
    component: ReturnGoodsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
