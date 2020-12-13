import {Component, Input, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter, AfterContentInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, NavigationExtras} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';
import {PresentService} from '../../../providers/present.service';
import {PublicService} from '../../../providers/public.service';

@Component({
    selector: 'app-materiel-item',
    templateUrl: 'materiel-item.page.html',
    styleUrls: ['materiel-item.page.scss'],
})
export class MaterielItemPage implements OnInit {
    @Input() scanNum: any = 0;
    @Input() hasScanNum: boolean = true;
    @Input() hasJHQty: boolean = false;
    @Input() hasTLQty: boolean = false;
    @Input() hideWh: boolean = false;
    @Input() materieObj = {};
    @Input() infoObj = {};


    constructor() {
    }

    ngOnInit() {
    }

}
