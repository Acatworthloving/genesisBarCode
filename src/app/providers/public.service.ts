import {Injectable} from '@angular/core';
import {PresentService} from './present.service';

@Injectable({
    providedIn: 'root'
})
export class PublicService {

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
                result = arr[1] + '*' + arr[4] + arr[5];
                break;
            case 'ItemCode':
                result = arr[1];
                break;
            case 'QTY':
                result = arr[2];
                break;
            case 'DistNumber':
                result = arr[3];
                break;
            case 'BFlag':
                result = arr[6];
                break;
            case 'LiuNo':
                result = arr[5];
                break;
            default:
                result = arr;
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

}
