import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PoMenuItem, PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';

@Component({
  selector: 'app-white',
  standalone: true,
  imports: [PoModule, PoTemplatesModule, FormsModule, CommonModule, RouterOutlet ],   
  templateUrl: './white.component.html',
  styleUrl: './white.component.css'
})
export class WhiteComponent {

}
