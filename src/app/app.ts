import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeddingProgram } from './components/wedding-program/wedding-program';
import { Countdown } from './components/countdown/countdown';
import { AssistanceForm } from './components/assistance-form/assistance-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeddingProgram, Countdown, AssistanceForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  diasRestantes: number = 0;

  ngOnInit(): void {
    const today: Date = new Date();
    const weddingDate: Date = new Date('2027-08-27');
    const minutesPerDay = 24 * 60 * 60 * 1000;

    const diferenciaMs = weddingDate.getTime() - today.getTime();
    this.diasRestantes = Math.ceil(diferenciaMs / minutesPerDay);
  }

  protected readonly title = signal('bodaEmaLidia');
}
