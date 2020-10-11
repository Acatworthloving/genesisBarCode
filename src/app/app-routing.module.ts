import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'other',
        loadChildren: () => import('./pages/other/other.module').then(m => m.OtherModule)
    },
    {
        path: 'stock',
        loadChildren: () => import('./pages/stock/stock.module').then(m => m.StockModule)
    },
    {
        path: 'quality-check',
        loadChildren: () => import('./pages/quality-check/quality-check.module').then(m => m.QualityCheckModule)
    },
    {
        path: 'purchase',
        loadChildren: () => import('./pages/purchase/purchase.module').then(m => m.PurchaseModule)
    },
    {
        path: 'box',
        loadChildren: () => import('./pages/box/box.module').then(m => m.BoxModule)
    },
    {
        path: 'production',
        loadChildren: () => import('./pages/production/production.module').then(m => m.ProductionModule)
    },
    {
        path: 'warning',
        loadChildren: () => import('./pages/warning/warning.module').then(m => m.WarningModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
