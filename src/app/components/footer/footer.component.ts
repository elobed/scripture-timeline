import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <!-- TODO: footer content — to be integrated in a future iteration -->
    <footer class="app-footer">
    </footer>
  `,
  styles: [`
    .app-footer {
      height: var(--footer-height);
      background: var(--color-bg-header);
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color var(--transition-normal);
      flex-shrink: 0;
    }
  `]
})
export class FooterComponent {}
