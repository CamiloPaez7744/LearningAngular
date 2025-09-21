import { DatePipe, LowerCasePipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { LocaleService } from '../../services/locale.service';
import { LocaleType } from '../../interfaces/locale.interface';

@Component({
  selector: 'app-basic-page',
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, SlicePipe, DatePipe],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  localeService = inject(LocaleService);
  currentLocale = signal(inject(LOCALE_ID));

  nameLower = signal('batman');
  nameUpper = signal('BATMAN');
  fullName = signal('Bruce Wayne');

  customDate = signal(new Date());

  tickingDateEffect = effect((onCleanup) => {
    const interval = setInterval(() => {
      this.customDate.set(new Date());
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  changeLocale(locale: LocaleType) {
    this.localeService.changeLocale(locale);
  }
}
