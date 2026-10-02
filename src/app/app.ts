import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  constructor() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'custom',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('icons/icons.svg'),
    );
  }
}
