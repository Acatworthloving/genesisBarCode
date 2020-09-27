import {Injectable} from '@angular/core';
import {PresentService} from './present.service';

@Injectable({
    providedIn: 'root'
})
export class PublicService {
    DocumentColumns: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '单据数量',
            prop: 'Quantity',
        },
        {
            name: '未清量',
            prop: 'QTY_NC',
        },
        {
            name: '当前扫描量',
            prop: 'QTY_CUR',
        },
        {
            name: '单号',
            prop: 'DocEntry',
        },
        {
            name: '编号',
            prop: 'DocNum',
        },
        {
            name: '行号',
            prop: 'LineNum',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '物料规格',
            prop: 'GGXH',
        },
    ];
    TableColumns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '收货数',
            prop: 'QTY',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '物料规格',
            prop: 'GGXH',
        },
        {
            name: '批次号/外箱序列号/序列号',
            prop: 'BatchNo',
        },
    ];

    constructor(public presentService: PresentService) {
    }

    splitStr(str, type?, sp?) {
        let result: any = '', typeText: any = '';
        const arr = str.split(sp || '*');
        switch (arr[0]) {
            case '10':
                typeText = 'Bar'; // 物料
                break;
            case '30':
                typeText = 'Whs'; // 仓库
                break;
            case '20':
                typeText = 'User'; // 员工
                break;
            case '25':
                typeText = 'PL'; // 生产线
                break;
            case '26':
                typeText = 'KB'; // 卡板
                break;
            case '40':
                typeText = 'DocEntry'; // 采购订单号
                break;
            case '42':
                typeText = 'DocEntry'; // 采购退货请求单号
                break;
            case '73':
                typeText = 'DocEntry'; // 库存拣配清单号
                break;
            case '52':
                typeText = 'DocEntry'; // 销售退货请求单号
                break;
            case '63':
                typeText = 'DocEntry'; // 生产计划号
                break;
            case '70':
                typeText = 'DocEntry'; // 库存收货草稿单号
                break;
            case '71':
                typeText = 'DocEntry'; // 库存发货草稿单号
                break;
            case '72':
                typeText = 'DocEntry'; // 库存转储请求单号
                break;
            default:
                this.presentService.presentToast('无效扫描', 'danger');
                return false;
                break;
        }
        if (type) {
            switch (type) {
                case 'type':
                    result = typeText;
                    break;
                default:
                    result = arr;
            }
        } else {
            result = arr;
        }
        return result;
    }

    getArrInfo(arr, type) {
        let result: any = '';
        switch (type) {
            case 'Barcode':
                result = arr[1] + '*' + arr[4] + arr[5]; // 物料编码*日期(年月日)*6位流水号
                break;
            case 'ItemCode':
                result = arr[1]; // 物料编码
                break;
            case 'QTY':
                result = arr[2];  // 收容数
                break;
            case 'DistNumber':
                result = arr[3]; // 批次号/序列号
                break;
            case 'BFlag':
                result = arr[6];  // 仓库管理类型(N:非批次/序列号管理；B:批次管理；S:序列号管理)
                break;
            case 'LiuNo':
                result = arr[5]; // 6位流水号
                break;
            default:
                result = arr; // 物料编码*收容数*批次号/序列号*日期(年月日)*6位流水号*仓库管理类型(N:非批次/序列号管理；B:批次管理；S:序列号管理)*属性1*属性2
        }
        return result;
    }


    arrSameId(arr, id, ItemCode) {
        let obj: any = null;
        for (const item of arr) {
            if (item[id] === ItemCode) {
                obj = item;
                break;
            }
        }
        return obj;
    }

    hasKey(arr, key) {
        let result = false;
        if (arr.indexOf(key) !== -1) {
            result = true;
        }
        return result;
    }

    hasQTY_NC(arr) {
        let result = true;
        for (let item of arr) {
            if (item['QTY_NC']) {
                this.presentService.presentToast('未扫描完单据中所有物料', 'warning');
                return true;
            } else {
                result = false;
            }
        }
        return result;
    }

}
