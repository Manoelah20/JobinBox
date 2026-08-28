import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { Opportunity } from '../../core/services/opportunity.service';
import { OpportunityService } from '../../core/services/opportunity.service';
import { OpportunityModal } from '../../shared/components/opportunity-modal/opportunity-modal';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-opportunities',
  imports: [OpportunityModal],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css',
})
export class Opportunities implements OnInit {
  private readonly opportunityService = inject(OpportunityService);
  private readonly toastService = inject(ToastService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  @ViewChild(OpportunityModal)
  protected readonly modal!: OpportunityModal;

  protected readonly opportunities = this.opportunityService.opportunities;

  protected readonly filteredOpportunities = this.opportunityService.filteredOpportunities;

  protected readonly statuses = this.opportunityService.statuses;

  protected readonly types = this.opportunityService.types;

  protected readonly filterStatus = this.opportunityService.filterStatus;

  protected readonly filterType = this.opportunityService.filterType;

  protected readonly searchTerm = this.opportunityService.searchTerm;

  protected readonly sortBy = this.opportunityService.sortBy;

  protected readonly sortOrder = this.opportunityService.sortOrder;

  protected readonly sortOptions = [
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'updatedAt', label: 'Atualização' },
    { value: 'title', label: 'Título' },
    { value: 'company', label: 'Empresa' },
    { value: 'relevanceScore', label: 'Relevância' },
  ] as const;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const editId = params['edit'];

      if (!editId) {
        return;
      }

      const opportunity = this.opportunityService.getById(editId);

      if (opportunity) {
        setTimeout(() => {
          this.modal.openEdit(opportunity);
        });
      }
    });
  }

  protected onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.opportunityService.setFilterStatus(value);
  }

  protected onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.opportunityService.setFilterType(value);
  }

  protected clearFilters(): void {
    this.opportunityService.clearFilters();
  }

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.opportunityService.setSearchTerm(value);
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.opportunityService.setSortBy(
        value as 'createdAt' | 'updatedAt' | 'title' | 'company' | 'relevanceScore',
      );
    }
  }

  protected clearSearch(): void {
    this.opportunityService.clearSearch();
  }

  protected exportJson(): void {
    const json = this.opportunityService.exportToJson();
    this.downloadFile(json, 'oportunidades.json', 'application/json');
    this.toastService.success('JSON exportado com sucesso');
  }

  protected exportCsv(): void {
    const csv = this.opportunityService.exportToCsv();
    this.downloadFile(csv, 'oportunidades.csv', 'text/csv');
    this.toastService.success('CSV exportado com sucesso');
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  protected openCreateModal(): void {
    this.modal.openCreate();
  }

  protected openEditModal(opportunity: Opportunity, event: Event): void {
    event.stopPropagation();

    this.modal.openEdit(opportunity);
  }

  protected deleteOpportunity(id: string, event: Event): void {
    event.stopPropagation();

    if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      this.opportunityService.delete(id);
      this.toastService.success('Oportunidade excluída');
    }
  }

  protected navigateToDetail(id: string): void {
    this.router.navigate(['/opportunities', id]);
  }

  protected getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Nova: 'nova',
      Interessante: 'interessante',
      'Em andamento': 'em-andamento',
      Acompanhando: 'acompanhando',
      'Enviado proposta': 'enviado-proposta',
      Entrevista: 'entrevista',
    };
    return map[status] || 'nova';
  }
}
