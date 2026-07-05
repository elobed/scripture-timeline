import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private isDark$ = new BehaviorSubject<boolean>(false);

  readonly isDarkMode$ = this.isDark$.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // Restore saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setDark(true);
    }
  }

  toggle(): void {
    this.setDark(!this.isDark$.value);
  }

  private setDark(dark: boolean): void {
    this.isDark$.next(dark);
    if (dark) {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
