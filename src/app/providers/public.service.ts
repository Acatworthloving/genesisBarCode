import {Injectable} from '@angular/core';
import {PresentService} from './present.service';
import {GetDataService} from './get-data.service';
import {NavController, Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PublicService {
    private backButtonSub: Subscription;
    DocumentColumns: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '行号',
            prop: 'LineNum',
        },
        {
            name: '未清量',
            prop: 'QTY_NC',
        },
        // {
        //     name: '单据数量',
        //     prop: 'Quantity',
        // },
        {
            name: '已扫描数量',
            prop: 'QTY_CUR',
        },
        // {
        //     name: '单号',
        //     prop: 'DocNum',
        // },
        // {
        //     name: '编号',
        //     prop: 'DocNum',
        // },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    TableColumns = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '行号',
            prop: 'LineNum',
        },
        {
            name: '收货数',
            prop: 'QTY',
        },
        {
            name: '批次/序列号',
            prop: 'BatchNo',
        },
        {
            name: '仓库',
            prop: 'Wh',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    TableColumns21 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '行号',
            prop: 'LineNum',
        },
        {
            name: '交货数',
            prop: 'QTY',
        },
        {
            name: '批次/序列号',
            prop: 'BatchNo',
        },
        {
            name: '仓库',
            prop: 'Wh',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    TableColumns3 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '领料数',
            prop: 'QTY',
        },
        {
            name: '批次/序列号',
            prop: 'BatchNo',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        {
            name: '仓库',
            prop: 'Wh',
        },
    ];
    TableColumns4 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '退料数',
            prop: 'QTY',
        },
        {
            name: '退料原因',
            prop: 'remark',
        },
        {
            name: '批次/序列号',
            prop: 'BatchNo',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        {
            name: '仓库',
            prop: 'Wh',
        },
    ];
    TableColumns2 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '转储数',
            prop: 'QTY',
        },
        {
            name: '批次/序列号',
            prop: 'BatchNo',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        {
            name: '从仓库',
            prop: 'Wh',
        },
        {
            name: '到仓库',
            prop: 'Wh_To',
        },
    ];
    Columns2: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '未清数量',
            prop: 'Quantity',
        },
        {
            name: '本次送检数量',
            prop: 'SJQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '已送检量',
            prop: 'JSQty',
        },
        // {
        //     name: '单号',
        //     prop: 'DocNum',
        // },
        // {
        //     name: '编号',
        //     prop: 'DocNum',
        // },
        {
            name: '行号',
            prop: 'LineNum',
        },
        // {
        //     name: '客户编码',
        //     prop: 'CardCode',
        // },
        // {
        //     name: '客户名称',
        //     prop: 'CardName',
        // },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    Columns3: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        // {
        //     name: '送检数量',
        //     prop: 'SJQty',
        // },
        {
            name: '待检数量',
            prop: 'Quantity',
        },
        {
            name: '质检方式',
            prop: 'ZJType',
            arr: ['全检', '抽检'],
            type: 'select',
        },
        {
            name: '质检数量',
            prop: 'ZJQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '接收数量',
            prop: 'JSQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '接收方式',
            prop: 'JSType',
            type: 'select',
            arr: ['全收', '让步接收', '部分接收', '退货']
        },
        {
            name: '不合格数量',
            prop: 'BHGQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '不合格原因',
            prop: 'BHGRemark',
            type: 'input',
            inputtype: 'text',
        },
        {
            name: '拒收数量',
            prop: 'RejectQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    Columns4: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '外箱编码',
            prop: 'WXCode',
        },
        {
            name: '序列号',
            prop: 'BatNo',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        // {
        //     name: '外箱单号',
        //     prop: 'DocNum',
        // },
        // {
        //     name: '已送检量',
        //     prop: 'Qty',
        // },
    ];
    Columns5 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '序列号',
            prop: 'BatNo',
        },
        // {
        //     name: '收货数',
        //     prop: 'Qty',
        // },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    Columns6: any = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '检验类型',
            prop: 'JYType',
            arr: ['库存返检', '库存维修'],
            type: 'select',
        },
        {
            name: '质检方式',
            prop: 'ZJType',
            arr: ['全检', '抽检'],
            type: 'select',
        },
        {
            name: '质检数量',
            prop: 'ZJQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '不合格数量',
            prop: 'BHGQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '不合格原因',
            prop: 'BHGRemark',
            type: 'input',
            inputtype: 'text',
        },
        {
            name: '接收方式',
            prop: 'JSType',
            type: 'select',
            arr: ['全收', '让步接收', '部分接收', '退货']
        },
        {
            name: '接收数量',
            prop: 'JSQty',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '拒收数量',
            prop: 'RejectQty',
            type: 'input',
            inputtype: 'number',
        },
    ];
    Columns7 = [
        {
            name: '卡板编码',
            prop: 'KBNum',
        },
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '外箱编码/标签序号',
            prop: 'BarCode',
        },
        {
            name: '批次号/序列号',
            prop: 'BarCode',
        },
        {
            name: '数量',
            prop: 'QTY',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        }
    ];
    Columns71 = [
        {
            name: '卡板编码',
            prop: 'KBNum',
        },
        {
            name: '外箱编码/标签序号',
            prop: 'BarCode',
        },
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '批次号/序列号',
            prop: 'BarCode',
        },
        {
            name: '数量',
            prop: 'QTY',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        }
    ];
    Columns8 = [
        {
            name: '生产订单号',
            prop: 'Order',
        },
        {
            name: '产线编码',
            prop: 'PLineCode',
        },
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        {
            name: '计划数量',
            prop: 'PlanQty',
        }
    ];
    Columns9 = [
        {
            name: '产线编码',
            prop: 'PLineCode',
        },
        {
            name: '故障类型',
            prop: 'FaultType',
            // arr: ['品质异常', '设备异常'],
            // type: 'select',
        },
        {
            name: '故障问题',
            prop: 'FaultProblem',
        },
        {
            name: '故障原因',
            prop: 'FaultReason',
            type: 'input',
            inputtype: 'text',
        },
        {
            name: '是否解除',
            prop: 'State',
            arr: ['是', '否'],
            type: 'select',
        },
    ];
    Columns10 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '批次/序列号',
            prop: 'BatNo',
        },
        {
            name: '已盘点数量',
            prop: 'QTY',
        },
        // {
        //     name: '仓库管理类型',
        //     prop: 'BFlag',
        // },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
    ];
    Columns12 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        {
            name: '批次/序列号',
            prop: 'BatNo',
        },
        {
            name: '盘点数',
            prop: 'QTY',
        },
        {
            name: '物料名称',
            prop: 'ItemName',
        },
        {
            name: '规格型号',
            prop: 'GGXH',
        },
        {
            name: '仓库',
            prop: 'WH',
        },
    ];
    Columns11 = [
        {
            name: '物料编码',
            prop: 'ItemCode',
        },
        // {
        //     name: '物料标签标识',
        //     prop: 'Barcode',
        // },
        {
            name: '扫描量',
            prop: 'QTY',
            type: 'input',
            inputtype: 'number',
        },
        {
            name: '打印张数',
            prop: 'NUM',
            type: 'input',
            inputtype: 'number',
        },
        // {
        //     name: '打印机',
        //     prop: 'PRINTER',
        //     arr: ['#1打印机', '#2打印机', '#3打印机'],
        //     type: 'select',
        // },
    ];
    DocNum = {
        CG: 40,
        CGTH: 42,
        KCJP: 73,
        XSTH: 52,
        SC: 63,
        KCSH: 70,
        KCFH: 71,
        KCZC: 72,
        CGSJ: 80,
        CGZJ: 81,
    };

    constructor(public presentService: PresentService,
                public getDataService: GetDataService,
                private navCtrl: NavController,
                private platform: Platform) {
    }

    splitStr(str, type?, sp?, canEnter?) {
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
            case '24':
                typeText = 'WX'; // 外箱
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
            case '80':
                typeText = 'DocEntry'; // 采购送检单
                break;
            case '81':
                typeText = 'DocEntry'; // 采购质检单
                break;
            default:
                if (!canEnter) {
                    this.presentService.presentToast('e32', 'danger');
                }
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
                result = arr[1] + arr[4] + arr[5]; // 物料编码*日期(年月日)*6位流水号
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
        result = isNaN(result) ? result : result.toString();
        return result;
    }


    arrSameId(arr, id, ItemCode, type?) {
        let obj: any = null, x = 0;

        for (const item of arr) {
            if (item[id] === ItemCode) {
                obj = type ? x : item;
                break;
            }
            x++;
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
                this.presentService.presentToast('e01', 'warning');
                return true;
            } else {
                result = false;
            }
        }
        return result;
    }


    // 检查库存
    checkInventory(BFlagObj, selectItem, documentIndex, obj, BFlag, key) {
        return new Promise((resolve, reject) => {
            // 获取库存接口，判断是否超库存
            const documentItem = selectItem;
            const config = {
                itemcode: obj.ItemCode,
                wh: obj.Wh,
                kw: obj.Kuwei || '',
                batNo: obj.BatchNo,
                batId: BFlag,
            };
            this.getDataService.getSapStoreQty(config).then((resp) => {
                if (resp['Data']) {
                    if (BFlag === 'B') {
                        // B:批次管理(库存等于所有(仓库管理类型 + 批次号/序列号 )一样的物料数 合计)
                        if (BFlagObj[key] + obj.QTY > resp['Data']) {
                            //  已扫描所有同B批次收容数+此物料收容数 >  库存
                            this.presentService.presentAlert('当前标签收货数大于库存，是否修改为库存量').then((kc) => {
                                if (kc) {
                                    // 修改为库存量
                                    obj.QTY = resp['Data'] - BFlagObj[key];
                                    const NC = Number(documentItem['Quantity']) - Number(documentItem['QTY_FIN']) - Number(resp['Data']);
                                    const CUR = resp['Data'];
                                    // this.successScan(documentIndex, obj, key, NC, CUR);
                                    const returnObj = {
                                        dIndex: documentIndex,
                                        Obj: obj,
                                        Key: key,
                                        N: NC,
                                        C: CUR
                                    };
                                    resolve(returnObj);
                                } else {
                                    resolve(false);
                                    this.presentService.presentToast('e14', 'warning');
                                }
                            });
                        } else {
                            // 所有同B批次收容数+此物料收容数 <= 库存
                            const NC = Number(documentItem['QTY_NC']) - Number(obj.QTY);
                            const CUR = Number(documentItem['QTY_CUR']) + Number(obj.QTY);
                            const returnObj = {
                                dIndex: documentIndex,
                                Obj: obj,
                                Key: key,
                                N: NC,
                                C: CUR
                            };
                            resolve(returnObj);
                        }
                    } else if (BFlag === 'N') {
                        // N:非批次/序列号管理
                        if (obj.QTY > resp['Data']) {
                            //  已扫描所有同B批次收容数+此物料收容数 >  库存
                            this.presentService.presentAlert('当前标签收货数大于库存，是否修改为库存量').then((kc) => {
                                if (kc) {
                                    // 修改为库存量
                                    obj.QTY = resp['Data'] - Number(documentItem['QTY_CUR']);
                                    const NC = Number(documentItem['Quantity']) - Number(documentItem['QTY_FIN']) - Number(resp['Data']);
                                    const CUR = resp['Data'];
                                    const returnObj = {
                                        dIndex: documentIndex,
                                        Obj: obj,
                                        Key: key,
                                        N: NC,
                                        C: CUR
                                    };
                                    resolve(returnObj);
                                } else {
                                    this.presentService.presentToast('e14', 'warning');
                                    resolve(false);
                                }
                            });
                        } else {
                            // 所有同B批次收容数+此物料收容数 <= 库存
                            const NC = Number(documentItem['QTY_NC']) - Number(obj.QTY);
                            const CUR = Number(documentItem['QTY_CUR']) + Number(obj.QTY);
                            const returnObj = {
                                dIndex: documentIndex,
                                Obj: obj,
                                Key: key,
                                N: NC,
                                C: CUR
                            };
                            resolve(returnObj);
                        }
                    } else {
                        // S:序列号管理
                        const returnObj = {
                            dIndex: documentIndex,
                            Obj: obj,
                            Key: key,
                            N: 0,
                            C: 1
                        };
                        resolve(returnObj);
                    }
                } else {
                    this.presentService.presentToast('e30', 'warning');
                    resolve(false);
                }
            });
        });
    }

    //返回按钮监听
    backPage() {
        // this.backButtonSub = this.platform.backButton.subscribeWithPriority(100, () => {
        // this.presentService.presentAlertReturn().then(res => {
        //     console.log('test2');
        //     if (res) {
        //         console.log('test3');
        //         this.navCtrl.navigateRoot('home');
        //     } else {
        //         console.log('test1');
        //     }
        // });
        // });
    }

    unsubBackPage() {
        if (this.backButtonSub) {
            this.backButtonSub.unsubscribe();
        }
    }

}
