import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  imports: [CommonModule, Skeleton],
  template: `
    <section class="dashboard-skeleton">
      <!-- Header skeleton -->
      <header class="dashboard-header-skeleton">
        <div>
          <app-skeleton variant="text" width="100px" height="16px" />
          <app-skeleton variant="text" width="250px" height="32px" />
          <app-skeleton variant="text" width="300px" height="20px" />
        </div>
        <app-skeleton variant="rect" width="180px" height="44px" />
      </header>

      <!-- Stats grid skeleton -->
      <section class="stats-grid-skeleton" aria-label="Resumo do JobInbox">
        @for (i of [1, 2, 3, 4, 5]; track i) {
          <article class="stat-card-skeleton">
            <app-skeleton variant="circle" width="44px" height="44px" />
            <div>
              <app-skeleton variant="text" width="60px" height="28px" />
              <app-skeleton variant="text" width="100px" height="13px" />
            </div>
          </article>
        }
      </section>

      <!-- Dashboard grid skeleton -->
      <section class="dashboard-grid-skeleton">
        <!-- Status card skeleton -->
        <article class="dashboard-card-skeleton status-card-skeleton">
          <div class="card-header-skeleton">
            <div>
              <app-skeleton variant="text" width="120px" height="12px" />
              <app-skeleton variant="text" width="180px" height="19px" />
            </div>
            <app-skeleton variant="rect" width="42px" height="42px" />
          </div>
          <div class="status-list-skeleton">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="status-row-skeleton">
                <div class="status-row-header-skeleton">
                  <div class="status-info-skeleton">
                    <app-skeleton variant="circle" width="9px" height="9px" />
                    <app-skeleton variant="text" width="100px" height="14px" />
                  </div>
                  <app-skeleton variant="text" width="30px" height="16px" />
                </div>
                <app-skeleton variant="rect" width="100%" height="6px" />
              </div>
            }
          </div>
        </article>

        <!-- Technology card skeleton -->
        <article class="dashboard-card-skeleton technical-card-skeleton">
          <div class="card-header-skeleton">
            <div>
              <app-skeleton variant="text" width="100px" height="12px" />
              <app-skeleton variant="text" width="200px" height="19px" />
            </div>
          </div>
          <div class="technology-ranking-skeleton">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="technology-ranking-item-skeleton">
                <app-skeleton variant="circle" width="26px" height="26px" />
                <app-skeleton variant="text" width="120px" height="13px" />
                <app-skeleton variant="text" width="30px" height="14px" />
              </div>
            }
          </div>
        </article>

        <!-- Recent opportunities skeleton -->
        <section class="recent-skeleton">
          <div class="section-header-skeleton">
            <div>
              <app-skeleton variant="text" width="80px" height="12px" />
              <app-skeleton variant="text" width="150px" height="19px" />
            </div>
            <app-skeleton variant="rect" width="100px" height="40px" />
          </div>
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <article class="opportunity-card-skeleton">
              <div class="opportunity-main-skeleton">
                <div class="opportunity-title-skeleton">
                  <app-skeleton variant="text" width="200px" height="16px" />
                  <app-skeleton variant="text" width="120px" height="14px" />
                </div>
                <div class="technology-tags-skeleton">
                  <app-skeleton variant="rect" width="80px" height="24px" />
                  <app-skeleton variant="rect" width="100px" height="24px" />
                </div>
              </div>
              <app-skeleton variant="rect" width="100px" height="28px" />
            </article>
          }
        </section>
      </section>
    </section>
  `,
  styles: [
    `
      .dashboard-skeleton {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px;
      }

      .dashboard-header-skeleton {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 32px;
        flex-wrap: wrap;
      }

      .stats-grid-skeleton {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 32px;
      }

      .stat-card-skeleton {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 22px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--bg-surface);
      }

      .dashboard-grid-skeleton {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 40px;
      }

      .dashboard-card-skeleton {
        padding: 24px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--bg-surface);
      }

      .card-header-skeleton {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
      }

      .status-list-skeleton {
        display: flex;
        flex-direction: column;
        gap: 17px;
      }

      .status-row-skeleton {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .status-row-header-skeleton {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .status-info-skeleton {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .technology-ranking-skeleton {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .technology-ranking-item-skeleton {
        display: grid;
        grid-template-columns: 30px minmax(0, 1fr) auto;
        align-items: center;
        gap: 9px;
        min-height: 48px;
        padding: 7px 10px;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--bg-page);
      }

      .section-header-skeleton {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .opportunity-card-skeleton {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        margin-bottom: 12px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--bg-surface);
      }

      .opportunity-main-skeleton {
        min-width: 0;
      }

      .opportunity-title-skeleton {
        margin-bottom: 10px;
      }

      .technology-tags-skeleton {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      @media (max-width: 950px) {
        .dashboard-grid-skeleton {
          grid-template-columns: 1fr;
        }
        .technology-ranking-skeleton {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .dashboard-skeleton {
          padding: 20px;
        }

        .dashboard-header-skeleton {
          align-items: flex-start;
          flex-direction: column;
        }

        .stats-grid-skeleton {
          grid-template-columns: 1fr;
        }

        .section-header-skeleton {
          align-items: flex-start;
          flex-direction: column;
        }

        .opportunity-card-skeleton {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class DashboardSkeleton {}
