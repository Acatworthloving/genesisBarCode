import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherPage } from './other.page';
import { ReceivingPage } from './receiving/receiving.page';
import { DeliverPage } from './deliver/deliver.page';

const routes: Routes = [
  {
    path: '',
    component: OtherPage
  },
  {
    path: 'receiving/:id',
    component: ReceivingPage
  },
  {
    path: 'deliver/:id',
    component: DeliverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherRoutingModule {}
