import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, inject, Injector } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import icons from './icons.svg' with { loader: 'text' };
import { Footer } from './shared/ui/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Bundled as text: icons render with their component, with no request after bootstrap.
    inject(MatIconRegistry).addSvgIconSetLiteralInNamespace(
      'custom',
      inject(DomSanitizer).bypassSecurityTrustHtml(icons),
    );
    this.focusPageHeadingOnNavigation();
  }

  /** After a client-side navigation, move focus to the new page's h1 (not on first load). */
  private focusPageHeadingOnNavigation() {
    const document = inject(DOCUMENT);
    const injector = inject(Injector);

    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() =>
        afterNextRender(() => document.querySelector<HTMLElement>('main h1')?.focus(), {
          injector,
        }),
      );
  }
}
