import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-assistance-form',
  imports: [],
  templateUrl: './assistance-form.component.html',
  styleUrl: './assistance-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistanceFormComponent {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();
  readonly submitted = output<{ name: string; attending: string }>();

  readonly name = signal('');
  readonly attending = signal('si');

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.name().trim()) return;
    this.submitted.emit({ name: this.name(), attending: this.attending() });
    this.name.set('');
  }
}
