import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.svg',
  styleUrl: './logo.scss',
  // Decorative: each screen provides its own (visually hidden) heading.
  host: { 'aria-hidden': 'true' },
})
export class Logo {}
