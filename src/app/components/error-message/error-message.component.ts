import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.less']
})
export class ErrorMessageComponent {
  @Input() message: string = '';

  @Output() onSubmit: EventEmitter<{}> = new EventEmitter<{}>();

  ok() {
    this.onSubmit.emit({});
  }
}
