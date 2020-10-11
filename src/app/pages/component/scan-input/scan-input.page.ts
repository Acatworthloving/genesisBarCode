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
        this.selected();
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value),
            hasUser = this.publicService.hasKey(this.scanType, 'User'),
            hasDocEntry = this.publicService.hasKey(this.scanType, 'DocEntry'),
            hasWhs = this.publicService.hasKey(this.scanType, 'Whs'),
            hasKB = this.publicService.hasKey(this.scanType, 'KB'),
            hasWX = this.publicService.hasKey(this.scanType, 'WX'),
            hasPL = this.publicService.hasKey(this.scanType, 'PL');
        if (!scanArr) {
            return false;
        }
        const type = this.publicService.splitStr(value, 'type');
        if (type === 'User') {
            if (hasUser) {
                this.infoObj['User'] = scanArr[1];
                this.presentService.presentToast('员工标签扫描成功');
            } else {
                this.presentService.presentToast('不需要扫描员工标签');
            }
        } else {
            if (this.infoObj['User'] || !hasUser) {
                if (type === 'PL') {
                    if (hasPL) {
                        this.infoObj['plcode'] = scanArr[1];
                        this.presentService.presentToast('生产线标签扫描成功');
                        this.selected();
                        this.func_PL();
                    } else {
                        this.presentService.presentToast('不需要扫描生产线标签');
                    }
                } else {
                    if (this.infoObj['plcode'] || !hasPL) {
                        if (type === 'KB') {
                            if (hasKB) {
                                this.infoObj['kbcode'] = scanArr[1];
                                this.presentService.presentToast('卡板标签扫描成功');
                                this.selected();
                                this.func_KB();
                            } else {
                                this.presentService.presentToast('不需要扫描卡板标签');
                            }
                        } else {
                            if (this.infoObj['kbcode'] || !hasKB) {
                                if (type === 'WX') {
                                    if (hasWX) {
                                        this.infoObj['wxcode'] = scanArr[1];
                                        this.infoObj['ItemCode'] = scanArr[2];
                                        this.presentService.presentToast('外箱标签扫描成功');
                                        this.selected();
                                        this.func_WX();
                                    } else {
                                        this.presentService.presentToast('不需要扫描外箱标签');
                                    }
                                } else {
                                    if (this.infoObj['wxcode'] || !hasWX) {
                                        if (type === 'DocEntry') {
                                            if (hasDocEntry) {
                                                this.infoObj['Bils_No'] = scanArr[1];
                                                this.presentService.presentToast('单号标签扫描成功');
                                                this.selected();
                                                this.func_DocEntry();
                                            } else {
                                                this.presentService.presentToast('不需要扫描单号标签');
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
                                                                    this.presentService.presentToast('仓库标签扫描成功');
                                                                } else if (res === 'Wh_To') {
                                                                    this.infoObj['Wh_To'] = scanArr[1];
                                                                    this.infoObj['ToKuwei'] = scanArr[2];
                                                                    this.presentService.presentToast('仓库标签扫描成功');
                                                                }
                                                            });
                                                        } else {
                                                            this.infoObj['Whs'] = scanArr[1];
                                                            this.presentService.presentToast('仓库标签扫描成功');
                                                        }
                                                    } else {
                                                        this.presentService.presentToast('不需要扫描仓库标签');
                                                    }
                                                } else {
                                                    if (this.hasTwoWh) {
                                                        if ((this.infoObj['Whs'] && this.infoObj['Wh_To']) || !hasWhs) {
                                                            this.func_addBar(value, scanArr);
                                                        } else {
                                                            if (!this.infoObj['Whs']) {
                                                                this.presentService.presentToast('请先扫描从仓库标签', 'warning');
                                                                return;
                                                            } else if (!this.infoObj['Wh_To']) {
                                                                this.presentService.presentToast('请先扫描到仓库标签', 'warning');
                                                            }
                                                        }
                                                    } else {
                                                        if (this.infoObj['Whs'] || !hasWhs) {
                                                            this.func_addBar(value, scanArr);
                                                        } else {
                                                            this.presentService.presentToast('请先扫描仓库标签', 'warning');
                                                        }
                                                    }

                                                }
                                            } else {
                                                this.presentService.presentToast('请先扫描单号标签', 'warning');
                                            }
                                        }
                                    } else {
                                        this.presentService.presentToast('请先扫描外箱标签', 'warning');
                                    }
                                }
                            } else {
                                this.presentService.presentToast('请先扫描卡板标签', 'warning');
                            }
                        }
                    } else {
                        this.presentService.presentToast('请先扫描生产线标签', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('请先扫描员工标签', 'warning');
            }
        }
    }

}
