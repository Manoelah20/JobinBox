import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { OpportunityService } from '../../core/services/opportunity.service';
import { Opportunities } from './opportunities';
import { OpportunityModal } from '../../shared/components/opportunity-modal/opportunity-modal';
import { ToastService } from '../../core/services/toast.service';
import { Opportunity } from '../../core/services/opportunity.service';

describe('Opportunities', () => {
  let component: Opportunities;
  let fixture: ComponentFixture<Opportunities>;
  let opportunityService: OpportunityService;
  let toastService: ToastService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opportunities],
      providers: [
        OpportunityService,
        ToastService,
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (callback: (params: Record<string, string>) => void) => {
                callback({});
                return {
                  unsubscribe: () => undefined,
                };
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Opportunities);
    component = fixture.componentInstance;

    opportunityService = TestBed.inject(OpportunityService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose opportunities and filters from the service', () => {
    expect(component['opportunities']).toBe(opportunityService.opportunities);
    expect(component['filteredOpportunities']).toBe(opportunityService.filteredOpportunities);
    expect(component['statuses']).toBe(opportunityService.statuses);
    expect(component['types']).toBe(opportunityService.types);
    expect(component['filterStatus']).toBe(opportunityService.filterStatus);
    expect(component['filterType']).toBe(opportunityService.filterType);
    expect(component['searchTerm']).toBe(opportunityService.searchTerm);
    expect(component['sortBy']).toBe(opportunityService.sortBy);
    expect(component['sortOrder']).toBe(opportunityService.sortOrder);
  });

  it('should expose the expected sort options', () => {
    expect(component['sortOptions']).toEqual([
      { value: 'createdAt', label: 'Data de criação' },
      { value: 'updatedAt', label: 'Atualização' },
      { value: 'title', label: 'Título' },
      { value: 'company', label: 'Empresa' },
      { value: 'relevanceScore', label: 'Relevância' },
    ]);
  });

  it('should change status filter', () => {
    const spy = vi.spyOn(opportunityService, 'setFilterStatus');
    const event = {
      target: { value: 'Interessante' },
    } as unknown as Event;

    component['onStatusChange'](event);

    expect(spy).toHaveBeenCalledWith('Interessante');
  });

  it('should change type filter', () => {
    const spy = vi.spyOn(opportunityService, 'setFilterType');
    const event = {
      target: { value: 'CLT' },
    } as unknown as Event;

    component['onTypeChange'](event);

    expect(spy).toHaveBeenCalledWith('CLT');
  });

  it('should clear filters', () => {
    const spy = vi.spyOn(opportunityService, 'clearFilters');

    component['clearFilters']();

    expect(spy).toHaveBeenCalled();
  });

  it('should change search term', () => {
    const spy = vi.spyOn(opportunityService, 'setSearchTerm');
    const event = {
      target: { value: 'React' },
    } as unknown as Event;

    component['onSearchChange'](event);

    expect(spy).toHaveBeenCalledWith('React');
  });

  it('should change sort option', () => {
    const spy = vi.spyOn(opportunityService, 'setSortBy');

    const event = {
      target: {
        value: 'title',
      },
    } as unknown as Event;

    component['onSortChange'](event);

    expect(spy).toHaveBeenCalledWith('title');
  });

  it('should ignore empty sort value', () => {
    const spy = vi.spyOn(opportunityService, 'setSortBy');

    const event = {
      target: {
        value: '',
      },
    } as unknown as Event;

    component['onSortChange'](event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should clear search', () => {
    const spy = vi.spyOn(opportunityService, 'clearSearch');

    component['clearSearch']();

    expect(spy).toHaveBeenCalled();
  });

  it('should export JSON and show success toast', () => {
    vi.spyOn(opportunityService, 'exportToJson').mockReturnValue('{"title":"Teste"}');

    const downloadSpy = vi
      .spyOn(component as unknown as { downloadFile: () => void }, 'downloadFile')
      .mockImplementation(() => undefined);

    const toastSpy = vi.spyOn(toastService, 'success');

    component['exportJson']();

    expect(downloadSpy).toHaveBeenCalledWith(
      '{"title":"Teste"}',
      'oportunidades.json',
      'application/json',
    );

    expect(toastSpy).toHaveBeenCalledWith('JSON exportado com sucesso');
  });

  it('should export CSV and show success toast', () => {
    vi.spyOn(opportunityService, 'exportToCsv').mockReturnValue('title,company\nTeste,Empresa');

    const downloadSpy = vi
      .spyOn(component as unknown as { downloadFile: () => void }, 'downloadFile')
      .mockImplementation(() => undefined);

    const toastSpy = vi.spyOn(toastService, 'success');

    component['exportCsv']();

    expect(downloadSpy).toHaveBeenCalledWith(
      'title,company\nTeste,Empresa',
      'oportunidades.csv',
      'text/csv',
    );

    expect(toastSpy).toHaveBeenCalledWith('CSV exportado com sucesso');
  });

  it('should open create modal', () => {
    const modal = component['modal'] as OpportunityModal;

    const spy = vi.spyOn(modal, 'openCreate');

    component['openCreateModal']();

    expect(spy).toHaveBeenCalled();
  });

  it('should open edit modal and stop event propagation', () => {
    const opportunity: Opportunity = {
      id: '1',
      title: 'Frontend Developer',
      company: 'Empresa',
      technologies: ['React'],
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: 'Descrição',
      link: '',
      salary: '',
      location: '',
      relevanceScore: 80,
      createdAt: '2026-08-28T10:00:00Z',
      updatedAt: '2026-08-28T10:00:00Z',
    };

    const modal = component['modal'] as OpportunityModal;

    const modalSpy = vi.spyOn(modal, 'openEdit');

    const stopPropagation = vi.fn();

    component['openEditModal'](opportunity, { stopPropagation } as unknown as Event);

    expect(stopPropagation).toHaveBeenCalled();

    expect(modalSpy).toHaveBeenCalledWith(opportunity);
  });

  it('should delete opportunity after confirmation', () => {
    const deleteSpy = vi.spyOn(opportunityService, 'delete');

    const toastSpy = vi.spyOn(toastService, 'success');

    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );

    const stopPropagation = vi.fn();

    component['deleteOpportunity']('123', { stopPropagation } as unknown as Event);

    expect(stopPropagation).toHaveBeenCalled();

    expect(deleteSpy).toHaveBeenCalledWith('123');

    expect(toastSpy).toHaveBeenCalledWith('Oportunidade excluída');

    vi.unstubAllGlobals();
  });

  it('should not delete opportunity when confirmation is cancelled', () => {
    const deleteSpy = vi.spyOn(opportunityService, 'delete');

    const toastSpy = vi.spyOn(toastService, 'success');

    vi.stubGlobal(
      'confirm',
      vi.fn(() => false),
    );

    component['deleteOpportunity']('123', {
      stopPropagation: vi.fn(),
    } as unknown as Event);

    expect(deleteSpy).not.toHaveBeenCalled();

    expect(toastSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should navigate to opportunity detail', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component['navigateToDetail']('123');

    expect(navigateSpy).toHaveBeenCalledWith(['/opportunities', '123']);
  });

  it('should return the correct status class', () => {
    expect(component['getStatusClass']('Nova')).toBe('nova');

    expect(component['getStatusClass']('Interessante')).toBe('interessante');

    expect(component['getStatusClass']('Em andamento')).toBe('em-andamento');

    expect(component['getStatusClass']('Acompanhando')).toBe('acompanhando');

    expect(component['getStatusClass']('Enviado proposta')).toBe('enviado-proposta');

    expect(component['getStatusClass']('Entrevista')).toBe('entrevista');
  });

  it('should return nova for an unknown status', () => {
    expect(component['getStatusClass']('Status desconhecido')).toBe('nova');
  });
});
