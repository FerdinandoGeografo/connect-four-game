import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-card appearance="filled" class="menu">
      <mat-card-content class="menu__content">
        <img src="images/logo.svg" alt="Connect Four game logo" />

        <div class="menu__actions">
          <button class="btn btn--secondary" matButton="filled" disableRipple>
            Play vs Player
            <mat-icon svgIcon="custom:player-vs-player" />
          </button>
          <a routerLink="/rules" class="btn btn--neutral btn--start" matButton="filled">
            Game rules
          </a>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      height: 100vh;
      background: var(--primary-800);
      display: flex;
      align-items: center;
      justify-content: center;

      .menu {
        max-width: 48rem;
        flex: 1;
        border: 3px solid var(--neutral-900);
        padding: 7rem 4rem 6rem;

        &__content {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 7.9rem;

          img {
            align-self: center;
          }
        }

        &__actions {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
      }
    }
  `,
})
export class MainMenu {}
