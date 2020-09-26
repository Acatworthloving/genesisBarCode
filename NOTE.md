
## Android fix
use plugin cordova-plugin-crosswalk-webview-v2
or 
use plugin cordova-plugin-ionic4-crosswalk-webview

cordova-android-support-gradle-release
use cordova@8.1.2

ionic cordova build android --prod --aot --minifyjs --minifycss --optimizejs --release
native-run android --app platforms/android/app/build/outputs/apk/debug/app-debug.apk --device
native-run android --app platforms/android/app/build/outputs/apk/armv7/debug/app-armv7-debug.apk --device

ionic cordova build android && native-run android --app platforms/android/app/build/outputs/apk/x86/debug/app-x86-debug.apk --virtual

bad plugin - 
facebook

npm install @ionic-native/ionic-webview --save

``` typescript
import { Market } from '@ionic-native/market/ngx'
import MobileDetect from 'mobile-detect'

declare interface NavigatorApp {
  exitApp (): void
}

declare interface Navigator {
  app: NavigatorApp
}

declare var navigator: Navigator

const ANDROID_VERSION_WITH_CHROME_WEBVIEW = 7
const CHROME_VERSION_WITH_CSS_GRID = 57

export class AppComponent {
  constructor (private market: Market) {
    void this.initializeApp()
  }

  async initializeApp (): Promise<void> {
    await this.platform.ready()

    const md = new MobileDetect(window.navigator.userAgent)

    if (md.is('AndroidOS')) {
      const androidVersion = md.version('Android') || 0
      const chromeVersion = md.version('Chrome') || 0
      if (chromeVersion < CHROME_VERSION_WITH_CSS_GRID) {
        if (androidVersion >= ANDROID_VERSION_WITH_CHROME_WEBVIEW) {
          alert(`Google Chrome (${chromeVersion}) is too old.\n\nTry to install newer version.`)
          await this.market.open('com.android.chrome')
        } else {
          alert(`Android System Webview (${chromeVersion}) is too old.\n\nTry to install newer version.`)
          await this.market.open('com.google.android.webview')
        }
        navigator.app.exitApp()
      }
    }
  }
}
```

## Good article to understand image manipulation
https://devdactic.com/ionic-4-image-upload-storage/

> ## Command to generate page

`npx ng g page pages/leave`

`npx ng g page pages/leave/leave-detail`

`npx ng g page pages/approver`

`npx ng g page pages/expense`

`npx ng g page pages/expense/add-claim`

`npx ng g page pages/expense/expense-detail`

`npx ng g page pages/profile`

`npx ng g page pages/profile/my-task`

`npx ng g page pages/forecast`

`npx ng g page pages/forecast/forecast-detail`

`npx ng g page pages/update-status`

`npx ng g page pages/timeEntry/timeEntry-action`

`npx ng g page pages/forecast/forecast-action`

`npx ng g page pages/leave/leave-action`

`npx ng g page pages/expense/item-detail`

`npx ng g page pages/expense/expense-action`

> ## Command to generate service

`npx ng g service api/games-data --spec=false`

`npx ng g service api/data --spec=false`

`npx ng g service providers/page-router --spec=false`

`npx ng g service shared/global-provider --spec=false`

> ## Command to generate module

`npx ng g module shared`

`npm install @ionic/storage --save`

## Refresh data

``` typescript
    this.reviewList = [];
    this.reviewListData = [];
    this.loading.loadingStatus = 'inactive';
    this.loading.loading = true;
    this.getEaring(0, event.target);

    if (resp.code == 200 && resp.data.length > 0) {
        const temp = this.conferenceData.orderBy(resp.data, '-review_time');
        temp.forEach(val => {
            val.review_time_text = this.timeService.getLastMsgTime(val.review_time);
        });
        this.reviewListData = temp;
        this.reviewList = [];
        for (let i = 0; i < 10; i++) {
            if (this.reviewListData.length > 0) {
                const item = this.reviewListData.splice(0, 1)[0];
                this.reviewList.push(item);
            } else {
                this.loading.loading = false;
            }
        }
    }
```

## Loadmore data

``` typescript
    console.log('loadMore...');
    this.loading.loadingText = '';
    setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            if (this.reviewListData.length > 0) {
                const item = this.reviewListData.splice(0, 1)[0];
                item.datalist = this.conferenceData.orderBy(item.datalist, '-review_time');
                this.reviewList.push(item);
                this.loading.loading = true;
            } else {
                this.loading.loading = false;
            }
        }
        this.loading.loadingStatus = 'complete';
        event.target.complete();
    }, Math.random() * (1000 + 1 - 300) + 300); // Math.random()*(n+1-m)+m //返回指定范围(m-n)的随机数
```

### Command to export .pem files 

`openssl pkcs12 -in /Users/jian/Desktop/ios_developer/aster/Aster_Dev.p12 -out /Users/jian/Desktop/ios_developer/aster/Aster_Dev.pem -nodes -clcerts`

`openssl pkcs12 -in /Users/jian/Desktop/ios_developer/aster/Aster_Dis.p12 -out /Users/jian/Desktop/ios_developer/aster/Aster_Dis.pem -nodes -clcerts`

> ### Example code for post data
```typescript
  this.presentService.presentLoading('Submitting');
        this.tutorDataService.setBankCard(config).subscribe(resp => {
            this.presentService.dismissLoading();
            if (resp.code === 200) {
                this.presentService.presentToast('Success');
                setTimeout(() => {
                    this.location.back();
                }, 1500);
            } else {
                if (resp.code) {
                    this.presentService.presentToast('e' + resp.code);
                } else {
                    this.presentService.presentToast('unKnowError');
                }
            }
        }, error => {
            this.presentService.dismissLoading();
            if (error.code) {
                this.presentService.presentToast('e' + error.code);
            } else {
                this.presentService.presentToast('unKnowError');
            }
        });
```

```typescript
    // 所有error code 800, 801, 802, 807, 808, 809, 814, 815, 816, 811
    if (resp.code) {
        switch (resp.code) { // 正常显示error code，其他全部显示failed
            case 803:
            case 804:
            case 403:
                this.presentService.presentToast('e' + resp.code);
                break;
            default:
                this.presentService.presentToast('ratingsFailed');
                break;
        }
    } else {
        this.presentService.presentToast('ratingsFailed');
    }
```
