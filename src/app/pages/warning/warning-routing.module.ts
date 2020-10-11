import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarningPage } from './warning.page';
import { AlarmPage } from './alarm/alarm.page';
import { DisarmedPage } from './disarmed/disarmed.page';

const routes: Routes = [
  {
    path: '',
    component: WarningPage
  },
  {
    path: 'alarm/:id',
    component: AlarmPage
  },
  {
    path: 'disarmed/:id',
    component: DisarmedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarningRoutingModule {}
