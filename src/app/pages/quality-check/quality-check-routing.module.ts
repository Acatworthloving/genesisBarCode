import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QualityCheckPage } from './quality-check.page';
import { IncomingPage } from './incoming/incoming.page';
import { IncomingQualityPage } from './incoming-quality/incoming-quality.page';
import { ProduceQualityPage } from './produce-quality/produce-quality.page';
import { StockQualityPage } from './stock-quality/stock-quality.page';

const routes: Routes = [
  {
    path: '',
    component: QualityCheckPage
  },
  {
    path: 'incoming/:id',
    component: IncomingPage
  },
  {
    path: 'stock-quality/:id',
    component: StockQualityPage
  },
  {
    path: 'incoming-quality/:id',
    component: IncomingQualityPage
  },
  {
    path: 'produce-quality/:id',
    component: ProduceQualityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualityCheckRoutingModule {}
