import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../../custom-validators/confirmValidator';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    name : ['', [Validators.required, Validators.minLength(3)] ],
    email : ['', [Validators.required, Validators.email] ],
    password : ['', [Validators.required, Validators.minLength(6)] ],
    confirmPassword : ['', [Validators.required] ],
    profileImg: ['']
  },
  {
    validator: ConfirmedValidator('password', 'confirmPassword'),
  })

  constructor(
    private formBuilder : FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  registerUser() {
    if(this.registerForm.invalid) {
      this.openSnackBar('Please fill all the details.', 'Ok');
    }
    console.log(this.registerForm.value);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
