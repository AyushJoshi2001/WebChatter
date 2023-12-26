import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  openSideNav: boolean = false;
  isDesktop: boolean = false;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.sideNavObserver();
    this.getIsDesktop();
  }

  sideNavObserver() {
    this.appService.getToggleSideNav().subscribe(
      (response: boolean) => {
        this.openSideNav = response;
      }
    )
  }

  getIsDesktop() {
    this.appService.getIsDesktop().subscribe(
      (response: boolean) => {
        this.isDesktop = response;
      }
    )
  }
}
