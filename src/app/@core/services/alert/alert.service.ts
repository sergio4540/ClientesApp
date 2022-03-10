import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private displayTime = 4500;

  showSuccess(message: string, displayTime?: number) {
    if (displayTime) {
      this.displayTime = displayTime;
    }
    notify({
      message,
      type: 'success',
      displayTime: this.displayTime,
      position: { my: 'top center', at: 'top center' },
    });
  }

  showInfo(message: string, displayTime?: number) {
    if (displayTime) {
      this.displayTime = displayTime;
    }
    notify({
      message,
      type: 'info',
      displayTime: this.displayTime,
      position: { my: 'top center', at: 'top center' },
    });
  }

  showWarning(message: string, displayTime?: number) {
    if (displayTime) {
      this.displayTime = displayTime;
    }
    notify({
      message,
      type: 'warning',
      displayTime: this.displayTime,
      position: { my: 'top center', at: 'top center' },
    });
  }

  showError(message: string, displayTime?: number) {
    if (displayTime) {
      this.displayTime = displayTime;
    }
    notify({
      message,
      type: 'error',
      displayTime: this.displayTime,
      position: { my: 'top center', at: 'top center' },
    });
  }
}