import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Opportunity } from '../../core/services/opportunity.service';
import { OpportunityService } from '../../core/services/opportunity.service';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './opportunity-detail.html',
  styleUrl: './opportunity-detail.css',
})
export class OpportunityDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly opportunityService = inject(OpportunityService);

  protected readonly opportunity = signal<Opportunity | null>(null);
  protected readonly notFound = signal(false);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const opp = this.opportunityService.getById(id);
      if (opp) {
        this.opportunity.set(opp);
      } else {
        this.notFound.set(true);
      }
    } else {
      this.notFound.set(true);
    }
    this.loading.set(false);
  }

  protected goBack(): void {
    this.router.navigate(['/opportunities']);
  }

  protected editOpportunity(): void {
    if (this.opportunity()) {
      this.router.navigate(['/opportunities'], { queryParams: { edit: this.opportunity()!.id } });
    }
  }

  protected deleteOpportunity(): void {
    if (this.opportunity() && confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      this.opportunityService.delete(this.opportunity()!.id);
      this.router.navigate(['/opportunities']);
    }
  }

  protected getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
