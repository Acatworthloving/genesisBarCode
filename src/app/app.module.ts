import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IonicStorageModule} from '@ionic/storage';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {CacheModule} from 'ionic-cache';
import {HttpsInterceptor} from './interceptors/https.interceptor';
import {GlobalFooService} from './providers/events.service';
import {SharedModule} from './module/shared.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(
            {
                name: '__t101db',
                driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
            }
        ),
        CacheModule.forRoot(),
        SharedModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        GlobalFooService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpsInterceptor,
            multi: true
        },
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
