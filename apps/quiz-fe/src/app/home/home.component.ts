import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'kepler-monorepo-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Welcome!</h1>
    <p>Let's fill some quiz?</p>
    <a routerLink="quiz">quiz</a>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
