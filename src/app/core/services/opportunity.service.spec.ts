import { TestBed } from '@angular/core/testing';
import { OpportunityService, Opportunity } from './opportunity.service';

describe('OpportunityService', () => {
  let service: OpportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportunityService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial opportunities on construction', () => {
    const opportunities = service.opportunities();
    expect(opportunities.length).toBeGreaterThan(0);
  });

  it('should add a new opportunity', () => {
    const initialCount = service.opportunities().length;

    const newOpp = service.add({
      title: 'Nova Vaga',
      company: 'Empresa Nova',
      technologies: ['Angular', 'TypeScript'],
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
    });

    expect(newOpp.id).toBeTruthy();
    expect(newOpp.title).toBe('Nova Vaga');
    expect(newOpp.company).toBe('Empresa Nova');
    expect(service.opportunities().length).toBe(initialCount + 1);
  });

  it('should update an existing opportunity', () => {
    const opportunities = service.opportunities();
    const firstOpp = opportunities[0];

    const updated = service.update(firstOpp.id, { title: 'Título Atualizado', status: 'Entrevista' });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Título Atualizado');
    expect(updated!.status).toBe('Entrevista');
    expect(service.getById(firstOpp.id)!.title).toBe('Título Atualizado');
  });

  it('should return null when updating non-existent opportunity', () => {
    const result = service.update('non-existent-id', { title: 'Test' });
    expect(result).toBeNull();
  });

  it('should delete an opportunity', () => {
    const opportunities = service.opportunities();
    const firstOpp = opportunities[0];
    const initialCount = opportunities.length;

    service.delete(firstOpp.id);

    expect(service.opportunities().length).toBe(initialCount - 1);
    expect(service.getById(firstOpp.id)).toBeUndefined();
  });

  it('should filter by status', () => {
    service.setFilterStatus('Nova');
    const filtered = service.filteredOpportunities();
    expect(filtered.every((o) => o.status === 'Nova')).toBe(true);
  });

  it('should filter by type', () => {
    service.setFilterType('CLT');
    const filtered = service.filteredOpportunities();
    expect(filtered.every((o) => o.type === 'CLT')).toBe(true);
  });

  it('should clear filters', () => {
    service.setFilterStatus('Nova');
    service.setFilterType('CLT');
    service.clearFilters();

    expect(service.filterStatus()).toBe('');
    expect(service.filterType()).toBe('');
    expect(service.filteredOpportunities().length).toBe(service.opportunities().length);
  });

  it('should import from JSON', () => {
    const initialCount = service.opportunities().length;

    const importData: Opportunity[] = [
      {
        id: 'new-1',
        title: 'Importada 1',
        company: 'Empresa Import',
        technologies: ['React'],
        type: 'CLT',
        status: 'Nova',
        workMode: 'Remota',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'new-2',
        title: 'Importada 2',
        company: 'Empresa Import',
        technologies: ['Vue'],
        type: 'PJ',
        status: 'Interessante',
        workMode: 'Híbrida',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const result = service.importFromJson(importData);

    expect(result.added).toBe(2);
    expect(result.updated).toBe(0);
    expect(service.opportunities().length).toBe(initialCount + 2);
  });

  it('should update existing opportunities on import', () => {
    const existing = service.opportunities()[0];
    const importData: Opportunity[] = [
      {
        ...existing,
        status: 'Entrevista',
        description: 'Descrição atualizada via import',
      },
    ];

    const result = service.importFromJson(importData);

    expect(result.added).toBe(0);
    expect(result.updated).toBe(1);
    expect(service.getById(existing.id)!.status).toBe('Entrevista');
    expect(service.getById(existing.id)!.description).toBe('Descrição atualizada via import');
  });

  it('should import from CSV', () => {
    const initialCount = service.opportunities().length;

    const csv = `title,company,technologies,type,status,workMode
Nova Vaga CSV,Empresa CSV,"React; TypeScript",CLT,Nova,Remota
Outra Vaga,Outra Empresa,"Angular; RxJS",PJ,Interessante,Híbrida`;

    const result = service.importFromCsv(csv);

    expect(result.added).toBe(2);
    expect(service.opportunities().length).toBe(initialCount + 2);
  });

  it('should export to JSON', () => {
    const json = service.exportToJson();
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(service.opportunities().length);
  });

  it('should export to CSV', () => {
    const csv = service.exportToCsv();
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(service.opportunities().length + 1);
    expect(lines[0]).toContain('title');
    expect(lines[0]).toContain('company');
  });

  it('should have correct computed counts', () => {
    expect(service.totalCount()).toBe(service.opportunities().length);
    expect(service.newCount()).toBe(service.opportunities().filter((o) => o.status === 'Nova').length);
    expect(service.inProgressCount()).toBe(service.opportunities().filter((o) => o.status === 'Em andamento').length);
  });

  it('should persist to localStorage', () => {
    service.add({
      title: 'Teste Persistência',
      company: 'Empresa Teste',
      technologies: ['Test'],
      type: 'CLT',
      status: 'Nova',
    });

    const stored = localStorage.getItem('jobinbox_opportunities');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.some((o: Opportunity) => o.title === 'Teste Persistência')).toBe(true);
  });
});