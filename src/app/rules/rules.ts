import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-card class="rules" appearance="outlined">
      <mat-card-content class="rules__content">
        <h1 class="heading heading--xl">Rules</h1>

        <div class="rules__item">
          <h2 class="rules__title heading heading--md">Objective</h2>
          <p class="rules__text text">
            Be the first player to connect 4 of the same colored discs in a row (either vertically,
            horizontally, or diagonally).
          </p>
        </div>

        <div class="rules__item">
          <h2 class="rules__title heading heading--md">How to play</h2>
          <ul class="rules__list text">
            <li>
              <span>1</span>
              <p>Red goes first in the first game.</p>
            </li>
            <li>
              <span>2</span>
              <p>Players must alternate turns, and only one disc can be dropped in each turn.</p>
            </li>
            <li>
              <span>3</span>
              <p>The game ends when there is a 4-in-a-row or a stalemate.</p>
            </li>
            <li>
              <span>4</span>
              <p>The starter of the previous game goes second on the next game.</p>
            </li>
          </ul>
        </div>
      </mat-card-content>
    </mat-card>
    <a matIconButton routerLink="/main-menu" [style.transform]="'translateY(-50%)'">
      <mat-icon svgIcon="custom:check" />
    </a>
  `,
  styles: `
    :host {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .rules {
        max-width: 48.6rem;
        padding: 3rem 3.4rem 5.4rem;

        &__content {
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2.9rem;

          h1 {
            align-self: center;
          }
        }

        &__item {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        &__title {
          color: var(--primary-600);
        }

        &__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          li {
            position: relative;

            span {
              position: absolute;
              left: 0;
              top: 0;
              color: var(--neutral-900);
              font-weight: 700;
            }

            p {
              margin-left: 2.7rem;
            }
          }
        }
      }
    }
  `,
})
export class Rules {}
