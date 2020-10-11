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
    };
    produceForm: FormGroup = new FormGroup({
        JYType: new FormControl('', [Validators.required]),
        ZJType: new FormControl('', [Validators.required]),
        ZJQty: new FormControl('', [Validators.required]),
        BHGQty: new FormControl(0),
        BHGRemark: new FormControl(''),
        JSType: new FormControl('', [Validators.required]),
        JSQty: new FormControl(0, [Validators.required]),
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
        this.produceForm.clearValidators();
    }

    getBillData() {
        const config = {
            order: this.infoObj.Bils_No
        };
        const request = this.dataService.getData('QC/GetSCZJBillData', config);
        request.subscribe(resp => {
            this.documentObj = resp.Data[0];
        }, error => {
            this.presentService.presentToast(error.message);
        });
    }

    submit() {
        const LstDetail = [];
        const config = this.infoObj;
        config['LstDetail'] = this.documentObj;
        this.clearData();
        // this.getDataService.CGZJSubmitScanData(config).then((resp) => {
        //     if (resp) {
        //         this.clearData();
        // }
        // });
    }
}
