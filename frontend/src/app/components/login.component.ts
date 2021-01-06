import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private authSvc: AuthService, private router: Router) { }
  loginForm: FormGroup

  ngOnInit(): void {
    this.loginForm = this.fb.group({

      user_id: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])

    })
  }


  async processForm() {
    const {user_id, password} = this.loginForm.value;
    await this.authSvc.login(user_id, password);
    this.router.navigate(['/main'])
  }

}
