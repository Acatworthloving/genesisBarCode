import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PageRouterService} from '../../providers/page-router.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    qualityList = [
        {
            name: '采购来料送检',
            prop: '',
            icon: 'assets/svg/svg1.svg'
        },
        {
            name: '采购来料品质检验',
            prop: '',
            icon: 'assets/svg/svg2.svg'
        },
        {
            name: '生产品质检验',
            prop: '',
            icon: 'assets/svg/svg3.svg'
        },
        {
            name: '库存品质检验',
            prop: '',
            icon: 'assets/svg/svg4.svg'
        },
    ];
    storehouseList = [
        {
            name: '采购收货',
            prop: '',
            icon: 'assets/svg/svg5.svg'
        },
        {
            name: '采购退货',
            prop: '',
            icon: 'assets/svg/svg6.svg'
        },
        {
            name: '仓库库存转储',
            prop: 'WHZCNO',
            href: 'stock/transfer-order',
            icon: 'assets/svg/svg7.svg'
        },
        {
            name: '执行库存转储请求',
            prop: 'WHSQZC',
            href: 'stock/dump-request',
            icon: 'assets/svg/svg8.svg'
        },
        {
            name: '生产上工扫描',
            prop: '',
            icon: 'assets/svg/svg9.svg'
        },
        {
            name: '生产下工扫描',
            prop: '',
            icon: 'assets/svg/svg10.svg'
        },
        {
            name: '工序报工扫描',
            prop: '',
            icon: 'assets/svg/svg11.svg'
        },
        {
            name: '生产完工入库',
            prop: '',
            icon: 'assets/svg/svg18.svg'
        },
        {
            name: '生产领料',
            prop: '',
            icon: 'assets/svg/svg12.svg'
        },
        {
            name: '生产退料',
            prop: '',
            icon: 'assets/svg/svg13.svg'
        },
        {
            name: '产品入箱',
            prop: '',
            icon: 'assets/svg/svg14.svg'
        },
        {
            name: '产品拆箱',
            prop: '',
            icon: 'assets/svg/svg15.svg'
        },
        {
            name: '卡板绑定',
            prop: '',
            icon: 'assets/svg/svg16.svg'
        },
        {
            name: '卡板解绑',
            prop: '',
            icon: 'assets/svg/svg17.svg'
        },
        {
            name: '生产线故障报警',
            prop: '',
            icon: 'assets/svg/svg19.svg'
        },
        {
            name: '生产线故障解除',
            prop: '',
            icon: 'assets/svg/svg20.svg'
        },
        {
            name: '其他收货',
            prop: 'WHSH',
            href: 'other/receiving',
            icon: 'assets/svg/svg21.svg'
        },
        {
            name: '其他发货',
            prop: 'WHFH',
            href: 'other/deliver',
            icon: 'assets/svg/svg22.svg'
        },
        {
            name: '销售出库',
            prop: '',
            icon: 'assets/svg/svg23.svg'
        },
        {
            name: '销售退货',
            prop: '',
            icon: 'assets/svg/svg24.svg'
        },
        {
            name: '库存盘点',
            prop: '',
            icon: 'assets/svg/svg25.svg'
        },
        {
            name: '库存查询',
            prop: '',
            icon: 'assets/svg/svg26.svg'
        },
    ];

    constructor(private router: Router,
                private pageRouterService: PageRouterService) {
    }

    ngOnInit() {
    }

    goPage(item) {
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
