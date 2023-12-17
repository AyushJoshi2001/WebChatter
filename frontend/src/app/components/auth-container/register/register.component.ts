import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../../Utils/custom-validators/confirmValidator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild('registerSuccess') registerSuccessRef!: ElementRef;

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
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
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
    
    this.authService.registerUser(this.registerForm.value).subscribe(
      (res: any) => {
        this.openDialog(this.registerSuccessRef);
      },
      (error: any) => {
        this.openSnackBar(error?.error, 'Ok')
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
    
  openDialog(context: any) {
    const dialogRef = this.dialog.open(context, {
      disableClose: true,
      panelClass: 'register',
      backdropClass: 'register-backdrop'
    })
    
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/auth/login');
    });
  }
}