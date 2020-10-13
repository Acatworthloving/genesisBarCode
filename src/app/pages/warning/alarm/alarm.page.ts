import {Component, OnInit} from '@angular/core';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';
import {GetDataService} from '../../../providers/get-data.service';
import {DataService} from '../../../api/data.service';
import {ActivatedRoute} from '@angular/router';
import {PageRouterService} from '../../../providers/page-router.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-alarm',
    templateUrl: './alarm.page.html'
})
export class AlarmPage implements OnInit {
    title: string = '';
    scanTypeArr = ['User', 'PL'];
    infoObj: any = {
        plcode: null,
        User: null,
    };
    materieObj: any = {};
    produceForm: FormGroup = new FormGroup({
        FaultType: new FormControl('', [Validators.required]),
        FaultProblem: new FormControl('', [Validators.required])
    });

    constructor(
        public presentService: PresentService,
        public publicService: PublicService,
        public dataService: DataService,
        public getDataService: GetDataService,
        public activatedRoute: ActivatedRoute,
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
        this.infoObj.plcode = null;
        this.produceForm.reset();
    }

    scanPL() {
    }

    submit() {
        const config = {
            User: this.infoObj.User,
            PLineCode: this.infoObj.plcode,
            FaultType: this.produceForm.get('FaultType').value,
            FaultProblem: this.produceForm.get('FaultProblem').value,
            FaultReason: '',
            State: 'N'
        };
        this.getDataService.submitPublicData('Warn/WarnSubmitScanData', config).then((resp) => {
            if (resp) {
                this.clearData();
            }
        });
    }
}
