import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbientAudioService } from './services/ambient-audio.service';
import { HeaderComponent } from './components/header/header.component';
import { AssistanceFormComponent } from './components/assistance-form/assistance-form.component';
import { WeddingTimelineComponent } from './components/wedding-timeline/wedding-timeline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AssistanceFormComponent,
    WeddingTimelineComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html'
})
export class AppComponent {
  readonly audio = inject(AmbientAudioService);
  readonly isRsvpOpen = signal(false);

  onRsvpSubmitted(data: { name: string; attending: string }): void {
    this.isRsvpOpen.set(false);
    alert(`¡Muchas gracias ${data.name}! Hemos registrado tu confirmación.`);
  }
}