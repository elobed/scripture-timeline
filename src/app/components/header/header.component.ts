import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- TODO: header content — to be integrated in a future iteration -->
    <header class="app-header" [class.hidden]="isHidden()">
      <div class="header-inner">
        <span class="header-brand">
          <span class="brand-icon">✝</span>
          <span class="brand-text">Línea del Tiempo Bíblica</span>
        </span>
        <div class="header-actions">
          <button
            class="theme-toggle"
            (click)="toggleTheme()"
            [attr.aria-label]="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            [title]="isDark ? 'Modo claro' : 'Modo oscuro'">
            <span class="toggle-icon">{{ isDark ? '☀️' : '🌙' }}</span>
            <span class="toggle-label">{{ isDark ? 'Claro' : 'Oscuro' }}</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      background: var(--color-bg-header);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      z-index: 100;
      transform: translateY(0);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  background-color var(--transition-normal),
                  border-color var(--transition-normal);
      will-change: transform;
    }

    .app-header.hidden {
      transform: translateY(-100%);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 24px;
      max-width: 100%;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .brand-icon {
      font-size: 1.25rem;
      color: var(--color-accent);
    }

    .brand-text {
      letter-spacing: 0.02em;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-md);
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      font-size: 0.85rem;
      font-family: var(--font-body);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .theme-toggle:hover {
      background: var(--color-surface-2);
      color: var(--color-text-primary);
    }

    .toggle-icon {
      font-size: 1rem;
      line-height: 1;
    }

    .toggle-label {
      display: none;
    }

    @media (min-width: 480px) {
      .toggle-label {
        display: inline;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isHidden = signal(false);
  isDark = false;

  private lastScrollY = 0;
  private scrollThreshold = 60;
  private sub?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.sub = this.themeService.isDarkMode$.subscribe(d => this.isDark = d);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentY = window.scrollY;
    if (currentY < this.scrollThreshold) {
      this.isHidden.set(false);
    } else if (currentY > this.lastScrollY) {
      // Scrolling down → hide header
      this.isHidden.set(true);
    } else {
      // Scrolling up → show header
      this.isHidden.set(false);
    }
    this.lastScrollY = currentY;
  }
}
