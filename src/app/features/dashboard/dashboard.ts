import { Component, computed, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { OpportunityService } from '../../core/services/opportunity.service';
import { InboxService } from '../../core/services/inbox.service';
import { OpportunityModal } from '../../shared/components/opportunity-modal/opportunity-modal';

@Component({
  selector: 'app-dashboard',
  imports: [OpportunityModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly opportunityService = inject(OpportunityService);
  private readonly inboxService = inject(InboxService);
  private readonly router = inject(Router);

  @ViewChild(OpportunityModal)
  protected readonly modal!: OpportunityModal;

  protected readonly totalOpportunities = this.opportunityService.totalCount;

  protected readonly newOpportunities = this.opportunityService.newCount;

  protected readonly inProgressOpportunities = this.opportunityService.inProgressCount;

  protected readonly pendingMessages = this.inboxService.pendingCount;

  protected readonly highRelevanceOpportunities = computed(
    () =>
      this.opportunities().filter(
        (opportunity) =>
          opportunity.relevanceScore !== undefined && opportunity.relevanceScore >= 70,
      ).length,
  );

  protected readonly opportunities = this.opportunityService.opportunities;

  protected readonly statusSummary = computed(() => {
    const opportunities = this.opportunities();

    return this.opportunityService.statuses.map((status) => ({
      status,
      count: opportunities.filter((opportunity) => opportunity.status === status).length,
    }));
  });

  protected readonly technologySummary = computed(() => {
    const opportunities = this.opportunities();
    const technologyMap = new Map<string, number>();

    for (const opportunity of opportunities) {
      for (const technology of opportunity.technologies) {
        technologyMap.set(technology, (technologyMap.get(technology) ?? 0) + 1);
      }
    }

    return Array.from(technologyMap.entries())
      .map(([technology, count]) => ({
        technology,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  });

  protected readonly recentOpportunities = computed(() =>
    [...this.opportunities()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  );

  protected openCreateModal(): void {
    this.modal.openCreate();
  }

  protected navigateToDetail(id: string): void {
    this.router.navigate(['/opportunities', id]);
  }

  protected navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  protected navigateToOpportunities(): void {
    this.router.navigate(['/opportunities']);
  }

  protected getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
