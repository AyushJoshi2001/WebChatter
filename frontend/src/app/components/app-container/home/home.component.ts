import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  openSideNav: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.sideNavObserver();
  }

  sideNavObserver() {
    this.userService.getToggleSideNav().subscribe(
      (res: Boolean) => {
        this.openSideNav = !this.openSideNav;
      }
    )
  }

}
