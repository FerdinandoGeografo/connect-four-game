import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.svg',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './logo.scss',
})
export class Logo {}
