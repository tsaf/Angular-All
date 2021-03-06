import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];

  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    // this.forbiddenNames.bind(this) -- trzeba uzyc bindowania this
    // zeby mozna bylo zachowac referencje
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email, this.forbiddenEmails])
      }),
      'gender': new FormControl('male', Validators.required),
      'hobbies': new FormArray([])
    });

    // sub to valueChanges
    // this.signupForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });

    // sub to statusChanges
    // this.signupForm.statusChanges.subscribe((status) => {
    //   console.log(status);
    // });


    // setValue ustawia wartości CAŁEGO formularza
    this.signupForm.setValue({
      'userData': {
        'username': 'Damian',
        'email': 'damian@mail.com'
      },
      'gender': 'male',
      'hobbies': []
    });

    // patchValue moze nadpisac / ustawic wartosci konkretnych pol w formularzu
    // nie ma potrzeby ustawiania all pol
    this.signupForm.patchValue({
      'userData': {
        'username': 'AloAlo'
      }
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    // resetuje CAŁY formularz
    this.signupForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    // castowanie w ts (<klasa>)
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  // custom validator
  // jesli używamy 'this' w metodzie to musimy uzyć bind(this)
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { 'nameIsForbidden': true };
    }
    // jesli walidacja przeszla, trzeba zwrocic null albo nic
    return null;
  }

  // custom async validator
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ 'emailIsForbidden': true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
