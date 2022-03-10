import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-type-person',
  templateUrl: './type-person.page.html',
  styleUrls: ['./type-person.page.scss'],
})
export class TypePersonPage {
  @Input() visible!: boolean;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHiding() {
    this.visibleChange.emit(false);
  }
}
