import {Component, Input, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
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
export class ScanInputPage implements OnInit {
    @Input() infoObj = {};
    @Input() scanType = [];
    @Output() addBar = new EventEmitter();
    @Output() funcDocEntry = new EventEmitter();


    constructor(private el: ElementRef,
                public presentService: PresentService,
                public publicService: PublicService,
                private renderer2: Renderer2) {
        // this.renderer2.setStyle(this.el.nativeElement.querySelector('.btn1'), 'background', 'green');
    }

    ngOnInit() {

    }

    func_addBar(val, scanArr) {
        console.log('value', val, scanArr);
        const obj = {
            value: val,
            arr: scanArr
        };
        this.addBar.emit(obj);
    }

    func_DocEntry() {
        this.funcDocEntry.emit();
    }

    scan(event) {
        const value = event.target.value,
            scanArr = this.publicService.splitStr(value),
            hasUser = this.publicService.hasKey(this.scanType, 'User'),
            hasDocEntry = this.publicService.hasKey(this.scanType, 'DocEntry'),
            hasWhs = this.publicService.hasKey(this.scanType, 'Whs');
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
                if (type === 'DocEntry') {
                    if (hasDocEntry) {
                        this.infoObj['Bils_No'] = scanArr[1];
                        this.presentService.presentToast('单号标签扫描成功');
                        this.func_DocEntry();
                    } else {
                        this.presentService.presentToast('不需要扫描单号标签');
                    }
                } else {
                    if (this.infoObj['Bils_No'] || !hasDocEntry) {
                        if (type === 'Whs') {
                            if (hasWhs) {
                                this.infoObj['Whs'] = scanArr[1];
                                this.presentService.presentToast('仓库标签扫描成功');
                            } else {
                                this.presentService.presentToast('不需要扫描仓库标签');
                            }
                        } else {
                            if (this.infoObj['Whs'] || !hasWhs) {
                                this.func_addBar(value, scanArr);
                            } else {
                                this.presentService.presentToast('请先扫描仓库标签', 'warning');
                            }
                        }
                    } else {
                        this.presentService.presentToast('请先扫描单号标签', 'warning');
                    }
                }
            } else {
                this.presentService.presentToast('请先扫描员工标签', 'warning');
            }
        }
    }

}
