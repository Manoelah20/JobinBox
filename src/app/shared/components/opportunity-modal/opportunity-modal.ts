import type { OnInit, OnDestroy } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Opportunity, OpportunityType } from '../../../core/services/opportunity.service';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';
import { ToastService } from '../../../core/services/toast.service';

export interface ModalData {
  mode: 'create' | 'edit';
  opportunity?: Opportunity;
}

@Component({
  selector: 'app-opportunity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FocusTrapDirective],
  templateUrl: './opportunity-modal.html',
  styleUrl: './opportunity-modal.css',
})
export class OpportunityModal implements OnInit, OnDestroy {
  private readonly opportunityService = inject(OpportunityService);
  private readonly toastService = inject(ToastService);

  protected readonly isOpen = signal(false);

  protected readonly isSubmitting = signal(false);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly mode = signal<'create' | 'edit'>('create');

  protected readonly editingId = signal<string | null>(null);

  protected readonly formData = signal<{
    title: string;
    company: string;
    technologies: string;
    type: OpportunityType;
    status: string;
    workMode: string;
    description: string;
    link: string;
    salary: string;
    location: string;
  }>({
    title: '',
    company: '',
    technologies: '',
    type: 'CLT',
    status: 'Nova',
    workMode: 'Remota',
    description: '',
    link: '',
    salary: '',
    location: '',
  });

  protected readonly types = this.opportunityService.types;

  protected readonly statuses = this.opportunityService.statuses;

  protected readonly workModes = this.opportunityService.workModes;

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeydown);

    document.body.style.overflow = '';
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  };

  openCreate(): void {
    this.mode.set('create');
    this.editingId.set(null);
    this.errorMessage.set(null);

    this.resetForm();

    this.isOpen.set(true);

    document.body.style.overflow = 'hidden';
  }

  openEdit(opportunity: Opportunity): void {
    this.mode.set('edit');
    this.editingId.set(opportunity.id);
    this.errorMessage.set(null);

    this.formData.set({
      title: opportunity.title,
      company: opportunity.company,
      technologies: opportunity.technologies.join(', '),
      type: opportunity.type,
      status: opportunity.status,
      workMode: opportunity.workMode || 'Remota',
      description: opportunity.description || '',
      link: opportunity.link || '',
      salary: opportunity.salary || '',
      location: opportunity.location || '',
    });

    this.isOpen.set(true);

    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    this.errorMessage.set(null);

    document.body.style.overflow = '';

    setTimeout(() => {
      this.resetForm();
    }, 200);
  }

  private resetForm(): void {
    this.formData.set({
      title: '',
      company: '',
      technologies: '',
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: '',
      link: '',
      salary: '',
      location: '',
    });
  }

  protected onSubmit(): void {
    const data = this.formData();

    if (!data.title.trim() || !data.company.trim()) {
      this.errorMessage.set('Título e empresa são obrigatórios');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const opportunityData = {
        title: data.title.trim(),
        company: data.company.trim(),

        technologies: data.technologies
          .split(',')
          .map((technology) => technology.trim())
          .filter(Boolean),

        type: data.type,
        status: data.status,
        workMode: data.workMode,

        description: data.description.trim() || undefined,

        link: data.link.trim() || undefined,

        salary: data.salary.trim() || undefined,

        location: data.location.trim() || undefined,
      };

      if (this.mode() === 'create') {
        this.opportunityService.add(opportunityData);
        this.toastService.success('Oportunidade criada com sucesso!');
      }

      if (this.mode() === 'edit' && this.editingId()) {
        this.opportunityService.update(this.editingId()!, opportunityData);
        this.toastService.success('Oportunidade atualizada com sucesso!');
      }

      this.close();
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erro desconhecido ao salvar');
      this.toastService.error('Erro ao salvar oportunidade');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
