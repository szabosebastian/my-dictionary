import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

}
