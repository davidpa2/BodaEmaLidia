import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly openRsvp = output<void>();

  private readonly target = new Date('2027-08-27T17:30:00').getTime();
  private readonly now = signal(Date.now());

  readonly countdown = computed(() => {
    const diff = Math.max(0, this.target - this.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
    };
  });

  constructor() {
    setInterval(() => this.now.set(Date.now()), 1000);
  }
}
