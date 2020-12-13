import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-incoming-quality',
    templateUrl: './produce-quality.page.html'
})
export class ProduceQualityPage implements OnInit {
    title: string = '';
    documentList: any = [];
    scanTypeArr = ['User', 'DocEntry'];
    documentColumns = [];
    infoObj: any = {
        Bils_No: null,
        Bil_ID: null,
        User: null,
        plcode: null
    };
    produceForm: FormGroup = new FormGroup({
        JYType: new FormControl('', [Validators.required]),
        ZJType: new FormControl('', [Validators.required]),
        ZJQty: new FormControl(null, [Validators.required]),
        BHGQty: new FormControl(null),
        BHGRemark: new FormControl(''),
        JSType: new FormControl('', [Validators.required]),
        JSQty: new FormControl(null, [Validators.required]),
        RejectQty: new FormControl(0),
    });
    documentObj = {};

    constructor(
        public presentService: PresentService,
        public dataService: DataService,
        public publicService: PublicService,
        public getDataService: GetDataService,
        public pageRouterService: PageRouterService
    ) {
        this.pageRouterService.getPageParams().then((res) => {
            if (res) {
                this.title = res['name'];
                this.infoObj.Bil_ID = res['id'];
            }
        });
    }

    ngOnInit() {
    }

    clearData() {
        this.produceForm.reset();
        this.documentObj = {};
    }

    scanPL() {
        const config = {
            order: this.infoObj.Bils_No
        };
        const request = this.dataService.getData('QC/GetSCZJBillData', config);
        request.subscribe(resp => {
            if (resp.Data.length) {
                this.documentObj = resp.Data[0];
            } else {
                this.documentObj = {};
                this.presentService.presentToast('e31', 'warning');
            }
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

    submit() {
        const form = this.produceForm;
        const ZJQty = Number(form.get('ZJQty').value), RejectQty = Number(form.get('RejectQty').value),
            JSQty = Number(form.get('JSQty').value), BHGQty = Number(form.get('BHGQty').value);
        if (form.get('ZJType').value === '全检') {
            if (ZJQty != RejectQty + JSQty) {
                this.presentService.presentToast('全检时,质检数量必须等于接收数量加拒收数量', 'warning');
                return;
            }
        }
        if (BHGQty > ZJQty) {
            this.presentService.presentToast('不合格数量不能大于质检数量', 'warning');
            return;
        }
        if (form.get('JSType').value === '全收') {
            if (RejectQty || JSQty < ZJQty) {
                this.presentService.presentToast('全收时,不能有拒收数量,接收数量不能小于质检数量', 'warning');
                return;
            }
        }
        if (form.get('JSType').value === '返工') {
            if (JSQty) {
                this.presentService.presentToast('返工时,不能有接收数量', 'warning');
                return;
            }
        }
        const config = {
            User: this.infoObj.User,
            LstDetail: [
                {
                    PlanCode: this.infoObj.Bils_No,
                    DocNum: this.documentObj['DocNum'],
                    PLineCode: this.documentObj['PLineCode'],
                    PLineName: this.documentObj['PLineName'],
                    ItemCode: this.documentObj['ItemCode'],
                    ItemName: this.documentObj['ItemName'],
                    GGXH: this.documentObj['GGXH'],
                    PlanQty: this.documentObj['PlanQty'],
                    JYType: form.get('JYType').value,
                    ZJType: form.get('ZJType').value,
                    ZJQty: form.get('ZJQty').value,
                    BHGQty: form.get('BHGQty').value,
                    BHGRemark: form.get('BHGRemark').value,
                    JSType: form.get('JSType').value,
                    JSQty: form.get('JSQty').value,
                    RejectQty: form.get('RejectQty').value
                }
            ]
        };
        this.getDataService.submitPublicData('QC/SCZJSubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }
}
