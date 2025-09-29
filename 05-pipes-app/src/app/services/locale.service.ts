import { Injectable, signal } from '@angular/core';
import { LocaleType } from '../interfaces/locale.interface';

@Injectable({providedIn: 'root'})
export class LocaleService {
  private currentLocale = signal<LocaleType>('es-CO');
  constructor() {
    this.currentLocale.set(
      localStorage.getItem('locale') as LocaleType ?? 'es-CO'
    )
  }

  get getLocale() {
    return this.currentLocale();
  }

  changeLocale(newLocale: LocaleType) {
    localStorage.setItem('locale', newLocale);
    this.currentLocale.set(newLocale);
    window.location.reload();
  }

}
