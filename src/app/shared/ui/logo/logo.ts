import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.svg',
  styleUrl: './logo.scss',
  host: { 'aria-hidden': 'true' },
})
export class Logo {}
