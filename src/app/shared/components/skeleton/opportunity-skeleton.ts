import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-opportunity-skeleton',
  standalone: true,
  imports: [CommonModule, Skeleton],
  template: `
    <article class="skeleton-card">
      <div class="skeleton-header">
        <app-skeleton variant="rect" width="100px" height="28px" />
        <app-skeleton variant="rect" width="200px" height="24px" />
      </div>
      <div class="skeleton-meta">
        <app-skeleton variant="rect" width="120px" height="20px" />
        <app-skeleton variant="rect" width="140px" height="20px" />
        <app-skeleton variant="rect" width="100px" height="20px" />
      </div>
      <div class="skeleton-tech">
        <app-skeleton variant="rect" width="80px" height="28px" />
        <app-skeleton variant="rect" width="100px" height="28px" />
        <app-skeleton variant="rect" width="70px" height="28px" />
      </div>
    </article>
  `,
  styles: [
    `
      .skeleton-card {
        padding: 24px;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--bg-surface);
      }

      .skeleton-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 18px;
      }

      .skeleton-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 18px;
      }

      .skeleton-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    `,
  ],
})
export class OpportunitySkeleton {}
