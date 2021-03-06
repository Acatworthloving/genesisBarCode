import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {PageRouterService} from '../../providers/page-router.service';
import {UserDataService} from '../../providers/user-data.service';
import {PresentService} from '../../providers/present.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    qualityList = [
        {
            name: '标签重打',
            prop: 'retype',
            href: 'other/retype',
            icon: 'assets/svg/svg27.svg'
        },
        {
            name: '采购来料送检',
            prop: 'CGSJ',
            href: 'quality-check/incoming',
            icon: 'assets/svg/svg1.svg'
        },
        {
            name: '采购质检收货',
            prop: 'CGRHQC',
            href: 'purchase/quality-receiving',
            icon: 'assets/svg/svg28.svg'
        },
        {
            name: '采购免检收货',
            prop: 'CGRH',
            href: 'purchase/receiving',
            icon: 'assets/svg/svg5.svg'
        },
        {
            name: '采购退货',
            prop: 'CGSQTH',
            href: 'purchase/return-goods',
            icon: 'assets/svg/svg6.svg'
        },
        {
            name: '库存转储',
            prop: 'WHZCNO',
            href: 'stock/transfer-order',
            icon: 'assets/svg/svg7.svg'
        },
        {
            name: '执行转储请求',
            prop: 'WHSQZC',
            href: 'stock/dump-request',
            icon: 'assets/svg/svg8.svg'
        },
        {
            name: '卡板绑定',
            prop: 'PXKB',
            href: 'box/bundling',
            icon: 'assets/svg/svg16.svg'
        },
        {
            name: '卡板解绑',
            prop: 'PXKB',
            href: 'box/unbundling',
            icon: 'assets/svg/svg17.svg'
        },
        {
            name: '销售交货',
            prop: 'XSCH',
            href: 'sale/out',
            icon: 'assets/svg/svg23.svg'
        },
        {
            name: '销售退货',
            prop: 'XSSQTH',
            href: 'sale/return',
            icon: 'assets/svg/svg24.svg'
        },
        {
            name: '库存收货',
            prop: 'WHSH',
            href: 'other/receiving',
            icon: 'assets/svg/svg21.svg'
        },
        {
            name: '库存发货',
            prop: 'WHFH',
            href: 'other/deliver',
            icon: 'assets/svg/svg22.svg'
        },
        {
            name: '库存盘点',
            prop: 'Inventory',
            href: 'stock/Inventory',
            icon: 'assets/svg/svg25.svg'
        },
        {
            name: '库存查询',
            prop: 'query',
            href: 'stock/query',
            icon: 'assets/svg/svg26.svg'
        },
    ];
    storehouseList = [
        {
            name: '生产领料',
            prop: 'SCFL',
            href: 'production/picking',
            icon: 'assets/svg/svg12.svg'
        },
        {
            name: '生产退料',
            prop: 'SCTL',
            href: 'production/return',
            icon: 'assets/svg/svg13.svg'
        },
        {
            name: '生产上工',
            prop: 'SX',
            href: 'production/up',
            icon: 'assets/svg/svg9.svg'
        },
        {
            name: '生产下工',
            prop: 'SX',
            href: 'production/down',
            icon: 'assets/svg/svg10.svg'
        },
        {
            name: '生产报工',
            prop: 'BG',
            href: 'production/finishing',
            icon: 'assets/svg/svg11.svg'
        },
        {
            name: '产品入箱',
            prop: 'PXKB',
            href: 'box/into-box',
            icon: 'assets/svg/svg14.svg'
        },
        {
            name: '产品拆箱',
            prop: 'PXKB',
            href: 'box/unpacking',
            icon: 'assets/svg/svg15.svg'
        },
        {
            name: '生产收货',
            prop: 'SCSL',
            href: 'production/completion',
            icon: 'assets/svg/svg18.svg'
        },
        {
            name: '生产线故障报警',
            prop: 'alarm',
            href: 'warning/alarm',
            icon: 'assets/svg/svg19.svg'
        },
        {
            name: '生产线故障解除',
            prop: 'disarmed',
            href: 'warning/disarmed',
            icon: 'assets/svg/svg20.svg'
        },
    ];
    PZList = [
        {
            name: '采购来料质检',
            prop: 'CGZJ',
            href: 'quality-check/incoming-quality',
            icon: 'assets/svg/svg2.svg'
        },
        {
            name: '生产品质检验',
            prop: 'CGZJ',
            href: 'quality-check/produce-quality',
            icon: 'assets/svg/svg3.svg'
        },
        {
            name: '库存品质检验',
            prop: 'CGZJ',
            href: 'quality-check/stock-quality',
            icon: 'assets/svg/svg4.svg'
        },
    ];
    XTList = [
        {
            name: '退出登录',
            prop: 'logout',
            href: '',
            icon: 'assets/svg/logout.svg'
        }
    ];

    constructor(private router: Router,
                public presentService: PresentService,
                private pageRouterService: PageRouterService,
                private userDataService: UserDataService,
                private toastController: ToastController) {

    }

    ngOnInit() {
        this.presentService.dismissToast();
    }

    goPage(item) {
        if (item.prop === 'logout') {
            this.userDataService.logout();
        } else {
            const data = {
                name: item.name,
                id: item.prop
            };
            if (item.href) {
                this.pageRouterService.toPage(item.href, item.prop, data);
                // this.router.navigate([item.href, item.prop]);
            }
        }
    }

    async dblclick() {
        const toast = await this.toastController.create({
            message: '当前版本 V1.7',
            position: 'bottom',
            duration: 2000
        });
        toast.present();
    }
}
