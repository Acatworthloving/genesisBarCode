import {Component, Input, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, NavigationExtras} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';

@Component({
    selector: 'app-table-edit',
    templateUrl: 'table-edit.page.html',
    styleUrls: ['table-edit.page.scss'],
})
export class TableEditPage implements OnInit {
    @Input() columns = [];
    @Input() tableList = [];
    @Input() tableId = '';
    @Input() hasDel = false;
    @Input() hasWQL = false;
    @Input() documentList = [];

    @ViewChild('table', {static: false}) tableView: ElementRef;

    constructor(private el: ElementRef,
                public presentService: PresentService,
                public publicService: PublicService,
                private renderer2: Renderer2) {
        // this.renderer2.setStyle(this.el.nativeElement.querySelector('.btn1'), 'background', 'green');
    }

    ngOnInit() {
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
