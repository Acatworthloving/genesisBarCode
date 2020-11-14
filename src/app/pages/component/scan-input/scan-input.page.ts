import {Component, Input, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter, AfterContentInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, NavigationExtras} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';

@Component({
    selector: 'app-scan-input',
    templateUrl: 'scan-input.page.html',
    styleUrls: ['scan-input.page.scss'],
})
export class ScanInputPage implements OnInit, AfterContentInit {
    @Input() infoObj = {};
    @Input() scanType = [];
    @Input() hasTwoWh: boolean = false;
    @Input() isSCSL: boolean = false;
    @Input() isXSSQTH: boolean = false;
    @Input() isStock: boolean = false;
    @Input() canEnter: boolean = false;
    @Input() docNum: number = 0;
    @Input() isOnlyNum: boolean = false;
    @Input() isSerialNum: boolean = false;
    @Output() addBar = new EventEmitter();
    @Output() funcDocEntry = new EventEmitter();
    @Output() getWX = new EventEmitter();
    @Output() getKB = new EventEmitter();
    @Output() getPL = new EventEmitter();

    @ViewChild('inputElement', {static: true}) inputView: ElementRef;


    constructor(public presentService: PresentService,
                public publicService: PublicService) {
        // this.renderer2.setStyle(this.el.nativeElement.querySelector('.btn1'), 'background', 'green');
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.inputView.nativeElement.focus();
        }, 1000);
    }

    func_addBar(val, scanArr) {
        const obj = {
            value: val,
            arr: scanArr
        };
        this.addBar.emit(obj);
    }

    func_DocEntry() {
        this.funcDocEntry.emit();
    }

    func_WX() {
        this.getWX.emit();
    }

    func_KB() {
        this.getKB.emit();
    }

    func_PL() {
        this.getPL.emit();
    }

    selected() {
        this.inputView.nativeElement.focus();
        this.inputView.nativeElement.select();
    }

    scan(event) {
        this.infoObj['User'] = localStorage.getItem('userName');
        if (this.isSCSL) {
            this.scanSCSL(event);
        } else if (this.isXSSQTH) {
            this.scanXSSQTH(event);
        } else if (this.isStock) {
            this.scanStock(event);
        } else if (this.isOnlyNum) {
            this.scanOnlyNum(event);
        } else if (this.isSerialNum) {
            this.scanSerialNum(event);
        } else {
            this.func_scan(event);
        }
    }

    func_scan(event) {
        this.selected();
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value, '', '', this.canEnter);
        const hasUser = this.publicService.hasKey(this.scanType, 'User'),
            hasDocEntry = this.publicService.hasKey(this.scanType, 'DocEntry'),
            hasWhs = this.publicService.hasKey(this.scanType, 'Whs'),
            hasKB = this.publicService.hasKey(this.scanType, 'KB'),
            hasWX = this.publicService.hasKey(this.scanType, 'WX'),
            hasPL = this.publicService.hasKey(this.scanType, 'PL');
        let type: string;

        //扫描的数据非带*的数据并且允许客户输入
        if (!scanArr) {
            if (this.canEnter) {
                type = 'DocEntry';
            } else {
                return false;
            }
        } else {
            type = this.publicService.splitStr(value, 'type');
        }
        if (type === 'User') {
            if (hasUser) {
                this.infoObj['User'] = scanArr[1];
                this.presentService.presentToast('e16');
            } else {
                this.presentService.presentToast('e17');
            }
        } else {
            if (this.infoObj['User'] || !hasUser) {
                if (type === 'PL') {
                    if (hasPL) {
                        this.infoObj['plcode'] = scanArr[1];
                        this.presentService.presentToast('e18');
                        this.selected();
                        this.func_PL();
                    } else {
                        this.presentService.presentToast('e19');
                    }
                } else {
                    if (this.infoObj['plcode'] || !hasPL) {
                        if (type === 'KB') {
                            if (hasKB) {
                                this.infoObj['kbcode'] = scanArr[1];
                                this.presentService.presentToast('e20');
                                this.selected();
                                this.func_KB();
                            } else {
                                this.presentService.presentToast('e21');
                            }
                        } else {
                            if (this.infoObj['kbcode'] || !hasKB) {
                                if (type === 'WX') {
                                    if (hasWX) {
                                        this.infoObj['wxcode'] = scanArr[1];
                                        this.infoObj['ItemCode'] = scanArr[2];
                                        this.presentService.presentToast('e22');
                                        this.selected();
                                        this.func_WX();
                                    } else {
                                        this.presentService.presentToast('e23');
                                    }
                                } else {
                                    if (this.infoObj['wxcode'] || !hasWX) {
                                        if (type === 'DocEntry') {
                                            if (hasDocEntry) {
                                                if (!scanArr && this.canEnter) {
                                                    this.infoObj['Bils_No'] = value;
                                                } else {
                                                    //判断标签类型是否正确
                                                    if (Number(scanArr[0]) == this.docNum) {
                                                        this.infoObj['Bils_No'] = scanArr[1];
                                                    } else {
                                                        this.presentService.presentToast('e46', 'warning');
                                                        return;
                                                    }
                                                }
                                                this.presentService.presentToast('e24');
                                                this.selected();
                                                this.func_DocEntry();
                                            } else {
                                                this.presentService.presentToast('e25');
                                            }
                                        } else {
                                            if (this.infoObj['Bils_No'] || !hasDocEntry) {
                                                if (type === 'Whs') {
                                                    if (hasWhs) {
                                                        if (this.hasTwoWh) {
                                                            const list = [
                                                                {
                                                                    title: '从仓库',
                                                                    value: 'Whs'
                                                                },
                                                                {
                                                                    title: '到仓库',
                                                                    value: 'Wh_To'
                                                                }
                                                            ];
                                                            // 需要扫描两个仓库时，需要选择仓库
                                                            this.presentService.presentAlertBaseRadio(list, '选择仓库').then((res) => {
                                                                this.selected();
                                                                if (res === 'Whs') {
                                                                    this.infoObj['Whs'] = scanArr[1];
                                                                    if (scanArr[2]) {
                                                                        this.infoObj['Kuwei'] = scanArr[2];
                                                                    }
                                                                    this.presentService.presentToast('e26');
                                                                } else if (res === 'Wh_To') {
                                                                    this.infoObj['Wh_To'] = scanArr[1];
                                                                    this.infoObj['ToKuwei'] = scanArr[2];
                                                                    this.presentService.presentToast('e26');
                                                                }
                                                            });
                                                        } else {
                                                            this.infoObj['Whs'] = scanArr[1];
                                                            this.presentService.presentToast('e26');
                                                        }
                                                    } else {
                                                        this.presentService.presentToast('e27');
                                                    }
                                                } else {
                                                    if (this.hasTwoWh) {
                                                        if ((this.infoObj['Whs'] && this.infoObj['Wh_To']) || !hasWhs) {
                                                            this.func_addBar(value, scanArr);
                                                        } else {
                                                            if (!this.infoObj['Whs']) {
                                                                this.presentService.presentToast('e28', 'warning');
                                                                return;
                                                            } else if (!this.infoObj['Wh_To']) {
                                                                this.presentService.presentToast('请先扫描到仓库标签', 'warning');
                                                            }
                                                        }
                                                    } else {
                                                        if (this.infoObj['Whs'] || !hasWhs) {
                                                            this.func_addBar(value, scanArr);
                                                        } else {
                                                            this.presentService.presentToast('e39', 'warning');
                                                        }
                                                    }

                                                }
                                            } else {
                                                this.presentService.presentToast('e43', 'warning');
                                            }
                                        }
                                    } else {
                                        this.presentService.presentToast('e44', 'warning');
                                    }
                                }
                            } else {
                                this.presentService.presentToast('e45', 'warning');
                            }
                        }
                    } else {
                        this.presentService.presentToast('e38', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('e29', 'warning');
            }
        }
    }

    scanSCSL(event) {
        this.selected();
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value);
        if (!scanArr) {
            return false;
        }
        const type = this.publicService.splitStr(value, 'type');
        if (type === 'User') {
            this.infoObj['User'] = scanArr[1];
            this.presentService.presentToast('e16');
        } else {
            if (this.infoObj['User']) {
                if (type === 'DocEntry') {
                    //判断标签类型是否正确
                    if (Number(scanArr[0]) == this.docNum) {
                        this.infoObj['Bils_No'] = scanArr[1];
                    } else {
                        this.presentService.presentToast('e46', 'warning');
                        return;
                    }
                    this.presentService.presentToast('e37');
                    this.selected();
                    this.func_DocEntry();
                } else {
                    if (this.infoObj['Bils_No']) {
                        if (type === 'Whs') {
                            this.infoObj['Whs'] = scanArr[1];
                            if (scanArr[2]) {
                                this.infoObj['Kuwei'] = scanArr[2];
                            }
                            this.presentService.presentToast('e26');
                        } else {
                            if (this.infoObj['Whs']) {
                                if (type === 'WX') {
                                    this.infoObj['wxcode'] = scanArr[1];
                                    this.infoObj['ItemCode'] = scanArr[2];
                                    this.presentService.presentToast('e22');
                                    this.selected();
                                    this.func_WX();
                                } else if (type === 'Bar') {
                                    this.func_addBar(value, scanArr);
                                } else {
                                    this.presentService.presentToast('e32', 'danger');
                                }
                            } else {
                                this.presentService.presentToast('e39', 'warning');
                            }
                        }
                    } else {
                        this.presentService.presentToast('请先扫描清单标签', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('请先扫描员工标签', 'warning');
            }
        }
    }

    scanXSSQTH(event) {
        this.selected();
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value);
        if (!scanArr) {
            return false;
        }
        const type = this.publicService.splitStr(value, 'type');
        if (type === 'User') {
            this.infoObj['User'] = scanArr[1];
            this.presentService.presentToast('e16');
        } else {
            if (this.infoObj['User']) {
                if (type === 'DocEntry') {
                    //判断标签类型是否正确
                    if (Number(scanArr[0]) == this.docNum) {
                        this.infoObj['Bils_No'] = scanArr[1];
                    } else {
                        this.presentService.presentToast('e46', 'warning');
                        return;
                    }
                    this.presentService.presentToast('e33');
                    this.selected();
                    this.func_DocEntry();
                } else {
                    if (this.infoObj['Bils_No']) {
                        if (type === 'Whs') {
                            this.infoObj['Whs'] = scanArr[1];
                            if (scanArr[2]) {
                                this.infoObj['Kuwei'] = scanArr[2];
                            }
                            this.presentService.presentToast('e26');
                        } else {
                            if (this.infoObj['Whs']) {
                                if (type === 'WX') {
                                    this.infoObj['wxcode'] = scanArr[1];
                                    this.infoObj['ItemCode'] = scanArr[2];
                                    this.presentService.presentToast('e22');
                                    this.selected();
                                    this.func_WX();
                                } else if (type === 'KB') {
                                    this.infoObj['kbcode'] = scanArr[1];
                                    this.presentService.presentToast('e20');
                                    this.selected();
                                    this.func_KB();
                                } else if (type === 'Bar') {
                                    this.func_addBar(value, scanArr);
                                } else {
                                    this.presentService.presentToast('e32', 'danger');
                                }
                            } else {
                                this.presentService.presentToast('e39', 'warning');
                            }
                        }
                    } else {
                        this.presentService.presentToast('请先扫描拣配清单标签', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('请先扫描员工标签', 'warning');
            }
        }
    }

    scanStock(event) {
        this.selected();
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value),
            hasUser = this.publicService.hasKey(this.scanType, 'User'),
            hasWhs = this.publicService.hasKey(this.scanType, 'Whs');
        if (!scanArr) {
            return false;
        }
        const type = this.publicService.splitStr(value, 'type');
        if (type === 'User') {
            if (hasUser) {
                this.infoObj['User'] = scanArr[1];
                this.presentService.presentToast('e16');
            } else {
                this.presentService.presentToast('e32', 'danger');
            }
        } else {
            if (this.infoObj['User'] || !hasUser) {
                if (type === 'Whs') {
                    this.infoObj['Whs'] = scanArr[1];
                    if (scanArr[2]) {
                        this.infoObj['Kuwei'] = scanArr[2];
                    }
                    this.presentService.presentToast('e26');
                } else {
                    if (this.infoObj['Whs'] || !hasWhs) {
                        if (type === 'WX') {
                            this.infoObj['wxcode'] = scanArr[1];
                            this.infoObj['ItemCode'] = scanArr[2];
                            this.presentService.presentToast('e22');
                            this.selected();
                            this.func_WX();
                        } else if (type === 'Bar') {
                            this.func_addBar(value, scanArr);
                        } else {
                            this.presentService.presentToast('e32', 'danger');
                        }
                    } else {
                        this.presentService.presentToast('e39', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('请先扫描员工标签', 'warning');
            }
        }
    }

    // 扫描纯序列号标签
    // 成品外箱标签只能绑定：【纯序列号标签】
    // 托盘标签只能绑定：【成品外箱标签】，【物料标签】
    scanOnlyNum(event) {
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value, '', '', this.canEnter);
        const hasWL = this.publicService.hasKey(this.scanType, 'WL'),
            hasKB = this.publicService.hasKey(this.scanType, 'KB'),
            hasWX = this.publicService.hasKey(this.scanType, 'WX');
        if (!scanArr) {
            this.infoObj['Bils_No'] = value;
            this.func_addBar(value, scanArr);
        } else {
            const type = this.publicService.splitStr(value, 'type');
            if (type === 'Bar' && hasWL) {
                this.func_addBar(value, scanArr);
            } else if (type === 'KB' && hasKB) {
                this.infoObj['kbcode'] = scanArr[1];
                this.presentService.presentToast('e20');
                this.func_KB();
            } else if (type === 'WX' && hasWX) {
                this.infoObj['wxcode'] = scanArr[1];
                this.infoObj['ItemCode'] = scanArr[2];
                this.presentService.presentToast('e22');
                this.func_WX();
            } else if (type === 'User') {
                this.infoObj['User'] = scanArr[1];
                this.presentService.presentToast('e16');
            } else {
                this.presentService.presentToast('e47', 'warning');
            }
            this.selected();
        }
    }

    // 生产完工入库：涉及到纯序列号标签和成品外箱标签以及物料标签扫描
    // 销售交货：涉及到纯序列号标签和成品外箱标签以及物料标签，托盘标签扫描
    // 销售退货：涉及纯序列号标签和物料标签
    scanSerialNum(event) {
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value, '', '', this.canEnter);
        const hasWL = this.publicService.hasKey(this.scanType, 'WL'),
            hasWX = this.publicService.hasKey(this.scanType, 'WX'),
            hasKB = this.publicService.hasKey(this.scanType, 'KB');
        if (this.infoObj['Bils_No']) {// 存在单号
            if (!scanArr) {// 扫描纯序列号
                this.infoObj['Bils_No'] = value;
                this.func_addBar(value, scanArr);
            } else {
                const type = this.publicService.splitStr(value, 'type');
                if (type === 'Bar' && hasWL) {
                    this.func_addBar(value, scanArr);
                } else if (type === 'KB' && hasKB) {
                    this.infoObj['kbcode'] = scanArr[1];
                    this.presentService.presentToast('e20');
                    this.func_KB();
                } else if (type === 'WX' && hasWX) {
                    this.infoObj['wxcode'] = scanArr[1];
                    this.infoObj['ItemCode'] = scanArr[2];
                    this.presentService.presentToast('e22');
                    this.func_WX();
                } else if (type === 'User') {
                    this.infoObj['User'] = scanArr[1];
                    this.presentService.presentToast('e16');
                } else if (type === 'Whs') {
                    this.infoObj['Whs'] = scanArr[1];
                    if (scanArr[2]) {
                        this.infoObj['Kuwei'] = scanArr[2];
                    }
                    this.presentService.presentToast('e26');
                } else {
                    this.presentService.presentToast('e47', 'warning');
                }
                this.selected();
            }
        } else {// 不存在单号
            if (!scanArr) {// 扫描纯序列号，提示先扫描单号
                this.presentService.presentToast('e43', 'warning');
                return;
            } else { // 扫描类型为单号，执行函数，非单号提示先扫描单号
                const type = this.publicService.splitStr(value, 'type');
                if (type === 'DocEntry') {
                    if (Number(scanArr[0]) == this.docNum) {
                        this.infoObj['Bils_No'] = scanArr[1];
                        this.presentService.presentToast('e24');
                        this.selected();
                        this.func_DocEntry();
                    } else {
                        this.presentService.presentToast('e46', 'warning');
                        return;
                    }
                } else if (type === 'User') {
                    this.infoObj['User'] = scanArr[1];
                    this.presentService.presentToast('e16');
                } else {
                    this.presentService.presentToast('e43', 'warning');
                    return;
                }
            }
        }
    }
}
