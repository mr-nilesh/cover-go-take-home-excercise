import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Country, InsuraneDetails, Package } from '@models';
import { SubscriberComponent } from '../base-subscriber/base-subscriber.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent extends SubscriberComponent implements OnInit {
  countryList: Country[] = [];
  packages: Package[] = [];
  userDetailsForm = {} as FormGroup;
  totalPremium: number = 0;
  standardPremium: number = 0;
  isSummary: boolean = false;
  isError: boolean = false;
  insuranceDetails: any = {};
  errorMessage: string = '';

  constructor(
    private _fb: FormBuilder,
    private _router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.countryList = this._getCountryList();
    this.packages = this._getPackageList();
    this._buildForm();
    this._subscribeToFormChanges();
  }

  submitUserDetails() {
    if (this.userDetailsForm.valid) {
      const formData = this.userDetailsForm.value;
      if (formData.age && parseInt(formData.age) > 100) {
        this.isError = true;
        this.errorMessage = `
          Your age is over our accepted limit. We are sorry but we cannot insure you now
        `;
        return;
      }
      this.insuranceDetails = {
        name: formData.name,
        age: formData.age,
        country: this.countryList.find((country: Country) => country.currency === formData.countryCurrency),
        package: formData.package,
        premium: this.totalPremium
      };
      this.isSummary = true;
    } else {
      this,this.userDetailsForm.markAllAsTouched();
    }
  }

  cancelSummaryMode() {
    // close the summary mode
    this.isSummary = false;
  }

  cancelErrorMode() {
    this._router.navigate(['/']);
  }

  buyInsurance(insuraneDetails: InsuraneDetails) {
    // TODO: Make API call to buy insurance
    this._router.navigate(['/']);
  }

  numbersOnly(event: KeyboardEvent) {
    const pattern = /^[0-9]\d*$/;
    if (event.type === 'keypress' && !pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  /******************** PRIVATE METHODS ************************/
  private _getCountryList(): Country[] {
    // TODO: This list we will get from API
    return [{
      name: 'Hong Kong',
      currency: 'HKD',
      rate: 1
    }, {
      name: 'USA',
      currency: 'USD',
      rate: 2
    }, {
      name: 'Australia',
      currency: 'AUD',
      rate: 3
    }];
  }

  private _getPackageList(): Package[] {
    // TODO: This list we will get from API
    return [{
      name: 'Standard',
      key: 'standard',
      pkgRatePercentage: 1
    }, {
      name: 'Safe',
      key: 'safe',
      pkgRatePercentage: 50
    }, {
      name: 'Super Safe',
      key: 'superSafe',
      pkgRatePercentage: 75
    }];
  }

  private _buildForm() {
    this.userDetailsForm = this._fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      countryCurrency: ['null', Validators.required],
      package: [this.packages[0], Validators.required]
    });
  }

  private _subscribeToFormChanges() {
    this.addSubscription(
      this.userDetailsForm.controls['age'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(
        _ => {
          this._listenToChanges();
        }
      )
    );

    this.addSubscription(
      this.userDetailsForm.controls['countryCurrency'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        _ => {
          this._listenToChanges();
        }
      )
    );

    this.addSubscription(
      this.userDetailsForm.controls['package'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(
        _ => {
          this._listenToChanges();
        }
      )
    );
  }

  /**
   * Listen to form changes like age, country and package.
   * And calculate the insurance premium.
   */
  private _listenToChanges() {
    let age = 0;
    if (this.userDetailsForm.value.age) {
      age = parseInt(this.userDetailsForm.value.age);
    }
    let rate = 0;
    if (this.userDetailsForm.value.countryCurrency) {
      const findCountry: (Country | undefined) = this.countryList.find((country: Country) => country.currency === this.userDetailsForm.value.countryCurrency);
      rate = findCountry && findCountry.rate || 1;
    }
    let per = 0;
    if (this.userDetailsForm.value.package && this.userDetailsForm.value.package.pkgRatePercentage) {
      per = this.userDetailsForm.value.package.pkgRatePercentage;
    }
    this._calculatePremium(age, rate, per);
  }

  /**
   * This function calculates the premium amount based on following formula
   * Standard premium = age * 10 * country rate
   * Total premium = (Standard premium * package percentage) / 100
   * @param age number
   * @param rate number
   * @param pkgPer number
   */
  private _calculatePremium(age: number, rate: number, pkgPer: number) {
    if (age && rate && pkgPer) {
      this.standardPremium = age * 10 * rate;
      this.totalPremium = this.standardPremium;
      if (pkgPer > 1) {
        this.totalPremium += (this.standardPremium * pkgPer) / 100;
      }
    } else {
      this.standardPremium = 0;
      this.totalPremium = 0;
    }
  }
}
