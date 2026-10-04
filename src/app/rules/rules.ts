import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [MatCard, MatCardContent, MatIconButton, MatIcon, RouterLink],
  templateUrl: './rules.html',
  styleUrl: './rules.scss',
})
export class Rules {
  protected readonly rules = [
    'Red goes first in the first game.',
    'Players must alternate turns, and only one disc can be dropped in each turn.',
    'The game ends when there is a 4-in-a-row or a stalemate.',
    'The starter of the previous game goes second on the next game.',
  ];
}
