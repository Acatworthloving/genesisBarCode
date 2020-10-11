import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoxPage } from './box.page';
import { IntoBoxPage } from './into-box/into-box.page';
import { UnpackingPage } from './unpacking/unpacking.page';
import { BundlingCardPage } from './bundling-card/bundling-card.page';
import { UnbundlingPage } from './unbundling/unbundling.page';

const routes: Routes = [
  {
    path: '',
    component: BoxPage
  },
  {
    path: 'into-box/:id',
    component: IntoBoxPage
  },
  {
    path: 'unpacking/:id',
    component: UnpackingPage
  },
  {
    path: 'bundling/:id',
    component: BundlingCardPage
  },
  {
    path: 'unbundling/:id',
    component: UnbundlingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoxRoutingModule {}
