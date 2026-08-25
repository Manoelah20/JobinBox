import {
  Component,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  OpportunityService,
  Opportunity,
} from '../../core/services/opportunity.service';
import { OpportunityModal } from '../../shared/components/opportunity-modal/opportunity-modal';

@Component({
  selector: 'app-opportunities',
  imports: [OpportunityModal],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css',
})
export class Opportunities implements OnInit {
  private readonly opportunityService =
    inject(OpportunityService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  @ViewChild(OpportunityModal)
  protected readonly modal!: OpportunityModal;

  protected readonly opportunities =
    this.opportunityService.opportunities;

  protected readonly filteredOpportunities =
    this.opportunityService.filteredOpportunities;

  protected readonly statuses =
    this.opportunityService.statuses;

  protected readonly types =
    this.opportunityService.types;

  protected readonly filterStatus =
    this.opportunityService.filterStatus;

  protected readonly filterType =
    this.opportunityService.filterType;

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => {
        const editId = params['edit'];

        if (!editId) {
          return;
        }

        const opportunity =
          this.opportunityService.getById(editId);

        if (opportunity) {
          setTimeout(() => {
            this.modal.openEdit(opportunity);
          });
        }
      }
    );
  }

  protected onStatusChange(event: Event): void {
    const value =
      (event.target as HTMLSelectElement).value;

    this.opportunityService.setFilterStatus(value);
  }

  protected onTypeChange(event: Event): void {
    const value =
      (event.target as HTMLSelectElement).value;

    this.opportunityService.setFilterType(value);
  }

  protected clearFilters(): void {
    this.opportunityService.clearFilters();
  }

  protected openCreateModal(): void {
    this.modal.openCreate();
  }

  protected openEditModal(
    opportunity: Opportunity,
    event: Event
  ): void {
    event.stopPropagation();

    this.modal.openEdit(opportunity);
  }

  protected deleteOpportunity(
    id: string,
    event: Event
  ): void {
    event.stopPropagation();

    if (
      confirm(
        'Tem certeza que deseja excluir esta oportunidade?'
      )
    ) {
      this.opportunityService.delete(id);
    }
  }

  protected navigateToDetail(id: string): void {
    this.router.navigate([
      '/opportunities',
      id,
    ]);
  }

  protected getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Nova': 'nova',
      'Interessante': 'interessante',
      'Em andamento': 'em-andamento',
      'Acompanhando': 'acompanhando',
      'Enviado proposta': 'enviado-proposta',
      'Entrevista': 'entrevista',
    };
    return map[status] || 'nova';
  }
}
