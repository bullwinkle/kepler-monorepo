import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'kepler-monorepo-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="content">
      <h1>Welcome!</h1>
      <p>Let's fill some quiz?</p>
      <a routerLink="quiz">SURE!</a>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
