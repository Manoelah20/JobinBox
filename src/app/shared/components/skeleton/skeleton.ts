import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton"
      [class.skeleton-text]="variant() === 'text'"
      [class.skeleton-circle]="variant() === 'circle'"
      [class.skeleton-rect]="variant() === 'rect'"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="borderRadius()"
      aria-hidden="true"
    ></div>
  `,
  styles: [
    `
      .skeleton {
        background: linear-gradient(
          90deg,
          var(--bg-surface-hover) 25%,
          var(--border) 50%,
          var(--bg-surface-hover) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md);
      }

      .skeleton-text {
        height: 1rem;
        border-radius: var(--radius-sm);
      }

      .skeleton-circle {
        border-radius: 50%;
      }

      .skeleton-rect {
        border-radius: var(--radius-lg);
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class Skeleton {
  variant = input<'text' | 'circle' | 'rect'>('rect');
  width = input<string>('100%');
  height = input<string>('16px');
  borderRadius = input<string>('');
}
