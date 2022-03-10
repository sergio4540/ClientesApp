import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebShellModule } from '@shell/ft/web-shell.module';
import { CoreModule } from './@core/core.module';
import { LanguageService } from './@core/services/language/language.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, WebShellModule],
  providers: [LanguageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
