import {Component, Input, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, NavigationExtras} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';

@Component({
    selector: 'app-table',
    templateUrl: 'table.page.html',
    styleUrls: ['table.page.scss'],
})
export class TablePage implements OnInit {
    @Input() columns = [];
    @Input() tableList = [];
    @Input() tableId = '';
    @Input() hasDel = false;
    @Input() hasPD = false;
    @Input() documentList = [];
    // @Output() documentList = new EventEmitter();

    @ViewChild('table', {static: false}) tableView: ElementRef;

    constructor(private el: ElementRef,
                public presentService: PresentService,
                public publicService: PublicService,
                private renderer2: Renderer2) {
        // this.renderer2.setStyle(this.el.nativeElement.querySelector('.btn1'), 'background', 'green');
    }

    ngOnInit() {
    }

    changeInput(event, oldNum, r) {
        const value = event.target.value;
        r['change'] = true;
        if (this.documentList.length) {
            const item = this.publicService.arrSameId(this.documentList, 'ItemCode', r.ItemCode);
            if (item) {
                const QTY_NC = Number(item['QTY_NC']) + Number(oldNum);
                if (value > QTY_NC) {
                    r['QTY'] = oldNum;
                    this.presentService.presentToast('e11', 'warning');
                } else {
                    item['QTY_NC'] = QTY_NC - Number(value);
                    item['QTY_CUR'] = Number(item.Quantity) - Number(item.QTY_FIN) - item['QTY_NC'];
                    r['QTY'] = value;
                    this.presentService.presentToast('e12');
                }
            }
        } else {
            r['QTY'] = value;
            if (!this.hasPD) {
                this.presentService.presentToast('e12');
            }
        }
    }

    public scroll(event) {
        if (this.tableId) {
            const x = document.getElementById(this.tableId).scrollLeft;
            const y = document.getElementById(this.tableId).scrollTop;
            const tds = document.getElementsByClassName('frozencol');
            for (let i = 0; i < tds.length; i++) {
                const num = (x - 1) > 0 ? x - 1 : 0;
                this.renderer2.setStyle(tds[i], 'left', num + 'px');
                // tds[i]['style']['left'] = num + 'px';
            }
        }
    }

    delete(num, r) {
        this.presentService.presentAlert('确认删除当前物料?').then((res) => {
            if (res) {
                for (const item of this.documentList) {
                    if (item.ItemCode === r.ItemCode) {
                        item['QTY_NC'] += r['QTY'];
                        item['QTY_CUR'] -= r['QTY'];
                        break;
                    }
                }
                this.tableList.splice(num, 1);
                this.presentService.presentToast('e08');
            }
        });
    }
}
