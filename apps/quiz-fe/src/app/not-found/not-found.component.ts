import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "kepler-monorepo-not-found",
  standalone: true,
  imports: [CommonModule],
  styleUrls: ["./not-found.component.scss"],
  template: `<p>404: Not found</p>`
})
export class NotFoundComponent {

}
