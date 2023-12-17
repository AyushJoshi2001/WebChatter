import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email : ['', [Validators.required, Validators.email] ],
    password : ['', [Validators.required, Validators.minLength(6)] ]
  })

  constructor(
    private formBuilder : FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
      
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  loginUser() {
    if(this.loginForm.invalid) {
      this.openSnackBar('Please fill all the details.', 'Ok');
    }

    this.authService.loginUser(this.loginForm.value).subscribe(
      (res: any) => {
        console.log(res);
      },
      (error: any) => {
        this.openSnackBar(error?.error, 'Ok')
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
