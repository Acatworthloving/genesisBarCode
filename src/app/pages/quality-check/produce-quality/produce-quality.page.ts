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
    scanTypeArr = ['User', 'PL'];
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
            order: this.infoObj.plcode
        };
        const request = this.dataService.getData('QC/GetSCZJBillData', config);
        request.subscribe(resp => {
            this.documentObj = resp.Data[0] || {};
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

    submit() {
        const config = {
            User: this.infoObj.User,
            LstDetail: [
                {
                    PlanCode: this.infoObj.plcode,
                    DocNum: this.documentObj['DocNum'],
                    PLineCode: this.documentObj['PLineCode'],
                    PLineName: this.documentObj['PLineName'],
                    ItemCode: this.documentObj['ItemCode'],
                    ItemName: this.documentObj['ItemName'],
                    GGXH: this.documentObj['GGXH'],
                    PlanQty: this.documentObj['PlanQty'],
                    JYType: this.produceForm.get('JYType').value,
                    ZJType: this.produceForm.get('ZJType').value,
                    ZJQty: this.produceForm.get('ZJQty').value,
                    BHGQty: this.produceForm.get('BHGQty').value,
                    BHGRemark: this.produceForm.get('BHGRemark').value,
                    JSType: this.produceForm.get('JSType').value,
                    JSQty: this.produceForm.get('JSQty').value,
                    RejectQty: this.produceForm.get('RejectQty').value
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
