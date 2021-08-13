import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onRegisterBtnClick(email: string, password: string, repeatPass: string) {
    if (email != '' && password != '' && repeatPass != '') {
      if (password === repeatPass) {
        this.authService
          .register(email, password)
          .subscribe((res: HttpResponse<any>) => {
            console.log(res);
            this.router.navigate(['/lists']);
          });
      } else {
        console.log("Passwords don't match");
      }
    } else {
      console.log('All fields are required!');
    }
  }
}
