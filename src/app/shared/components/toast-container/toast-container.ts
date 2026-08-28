import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toasts().length > 0) {
      <div class="toast-container" role="region" aria-label="Notificações" aria-live="polite">
        @for (toast of toasts(); track toast.id) {
          <div class="toast toast-{{ toast.type }}" role="alert">
            <div class="toast-icon" aria-hidden="true">
              @if (toast.type === 'success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              } @else if (toast.type === 'error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              } @else if (toast.type === 'warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            </div>
            <div class="toast-content">
              <span class="toast-message">{{ toast.message }}</span>
            </div>
            <button
              type="button"
              class="toast-close"
              (click)="dismiss(toast.id)"
              aria-label="Fechar notificação"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: var(--z-toast);
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 380px;
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border-radius: var(--radius-lg);
        background: var(--bg-surface);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-xl);
        pointer-events: auto;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .toast.success {
        border-left: 4px solid var(--success);
      }

      .toast.error {
        border-left: 4px solid var(--danger);
      }

      .toast.warning {
        border-left: 4px solid var(--warning);
      }

      .toast.info {
        border-left: 4px solid var(--info);
      }

      .toast-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast.success .toast-icon {
        color: var(--success);
      }

      .toast.error .toast-icon {
        color: var(--danger);
      }

      .toast.warning .toast-icon {
        color: var(--warning);
      }

      .toast.info .toast-icon {
        color: var(--info);
      }

      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-message {
        font-size: 14px;
        color: var(--text-primary);
        line-height: 1.5;
      }

      .toast-close {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition:
          color var(--transition-fast),
          background-color var(--transition-fast);
      }

      .toast-close:hover {
        color: var(--text-primary);
        background: var(--bg-surface-hover);
      }

      .toast-close svg {
        width: 16px;
        height: 16px;
      }

      @media (max-width: 700px) {
        .toast-container {
          top: 16px;
          right: 16px;
          left: 16px;
          max-width: none;
        }
      }
    `,
  ],
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);

  protected readonly toasts = this.toastService.toasts;

  protected dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
