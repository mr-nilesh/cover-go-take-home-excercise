import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InsuraneDetails } from '@models';

@Component({
  selector: 'app-insurance-summary',
  templateUrl: './insurance-summary.component.html',
  styleUrls: ['./insurance-summary.component.less']
})
export class InsuranceSummaryComponent implements OnInit {
  @Input() insuraneDetails: InsuraneDetails = {
    name: '',
    age: '',
    country: {
      name: '',
      currency: '',
      rate: 1
    },
    package: {
      name: '',
      key: '',
      pkgRatePercentage: 1
    },
    premium: 0
  };

  @Output() onCancel: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() onBuy: EventEmitter<InsuraneDetails> = new EventEmitter<InsuraneDetails>();

  ngOnInit() {}

  moveBack() {
    this.onCancel.emit({});
  }

  buyInsurance() {
    this.onBuy.emit(this.insuraneDetails);
  }
}
