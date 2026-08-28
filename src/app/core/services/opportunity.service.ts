import { Injectable, signal, computed } from '@angular/core';

export type OpportunityType = 'CLT' | 'PJ' | 'Estágio' | 'Trainee' | 'Curso' | 'Evento' | 'Outro';
export interface Opportunity {
  id: string;
  title: string;
  company: string;
  technologies: string[];
  type: OpportunityType;
  status: string;
  workMode?: string;
  description?: string;
  link?: string;
  salary?: string;
  location?: string;
  relevanceScore?: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'jobinbox_opportunities';

const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Front-End Developer Jr',
    company: 'Empresa Exemplo',
    technologies: ['React', 'TypeScript', 'Next.js'],
    type: 'CLT',
    status: 'Nova',
    workMode: 'Remota',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Desenvolvedora Front-End Pleno',
    company: 'Startup Exemplo',
    technologies: ['Angular', 'TypeScript'],
    type: 'CLT',
    status: 'Interessante',
    workMode: 'Híbrida',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    title: 'Engenheira de Software',
    company: 'Empresa Tech',
    technologies: ['Python', 'AWS', 'Docker'],
    type: 'PJ',
    status: 'Em andamento',
    workMode: 'Remota',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    title: 'Desenvolvedora React Sênior',
    company: 'Global Tech',
    technologies: ['React', 'TypeScript', 'Node.js'],
    type: 'CLT',
    status: 'Acompanhando',
    workMode: 'Remota',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '5',
    title: 'Desenvolvedora Mobile',
    company: 'App Solutions',
    technologies: ['Flutter', 'Dart'],
    type: 'CLT',
    status: 'Enviado proposta',
    workMode: 'Presencial',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2023-12-28T10:00:00Z',
    updatedAt: '2023-12-28T10:00:00Z',
  },
  {
    id: '6',
    title: 'Desenvolvedora Front-End Pleno',
    company: 'E-commerce Pro',
    technologies: ['React', 'Vue.js'],
    type: 'CLT',
    status: 'Em andamento',
    workMode: 'Híbrida',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
  },
  {
    id: '7',
    title: 'Desenvolvedora Front-End Pleno',
    company: 'Fintech Solutions',
    technologies: ['TypeScript', 'Angular', 'RxJS'],
    type: 'CLT',
    status: 'Interessante',
    workMode: 'Remota',
    description: '',
    link: '',
    salary: '',
    location: '',
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2023-12-15T10:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private readonly _opportunities = signal<Opportunity[]>([]);
  private readonly _filterStatus = signal<string>('');
  private readonly _filterType = signal<string>('');
  private readonly _searchTerm = signal<string>('');
  private readonly _sortBy = signal<
    'createdAt' | 'updatedAt' | 'title' | 'company' | 'relevanceScore'
  >('createdAt');
  private readonly _sortOrder = signal<'asc' | 'desc'>('desc');

  readonly opportunities = this._opportunities.asReadonly();
  readonly filterStatus = this._filterStatus.asReadonly();
  readonly filterType = this._filterType.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly sortOrder = this._sortOrder.asReadonly();

  readonly statuses = [
    'Nova',
    'Interessante',
    'Em andamento',
    'Acompanhando',
    'Enviado proposta',
    'Entrevista',
  ];

  readonly types: OpportunityType[] = [
    'CLT',
    'PJ',
    'Estágio',
    'Trainee',
    'Curso',
    'Evento',
    'Outro',
  ];
  readonly workModes = ['Remota', 'Híbrida', 'Presencial'];

  readonly filteredOpportunities = computed(() => {
    const status = this._filterStatus();
    const type = this._filterType();
    const search = this._searchTerm().toLowerCase().trim();
    const sortBy = this._sortBy();
    const sortOrder = this._sortOrder();

    const filtered = this._opportunities().filter((opportunity) => {
      const statusMatch = !status || opportunity.status === status;
      const typeMatch = !type || opportunity.type === type;
      const searchMatch =
        !search ||
        opportunity.title.toLowerCase().includes(search) ||
        opportunity.company.toLowerCase().includes(search) ||
        opportunity.technologies.some((t) => t.toLowerCase().includes(search)) ||
        opportunity.description?.toLowerCase().includes(search) ||
        opportunity.location?.toLowerCase().includes(search);
      return statusMatch && typeMatch && searchMatch;
    });

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy] ?? '';
      let bValue: string | number = b[sortBy] ?? '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  });

  readonly totalCount = computed(() => this._opportunities().length);
  readonly newCount = computed(
    () => this._opportunities().filter((o) => o.status === 'Nova').length,
  );
  readonly inProgressCount = computed(
    () => this._opportunities().filter((o) => o.status === 'Em andamento').length,
  );

  private normalizeType(type: unknown): OpportunityType {
    const value = String(type ?? '').trim();

    switch (value.toLowerCase()) {
      case 'clt':
        return 'CLT';

      case 'pj':
        return 'PJ';

      case 'estágio':
      case 'estagio':
        return 'Estágio';

      case 'trainee':
        return 'Trainee';

      case 'curso':
        return 'Curso';

      case 'evento':
        return 'Evento';

      case 'outro':
        return 'Outro';

      default:
        return 'Outro';
    }
  }

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this._opportunities.set(parsed);
      } else {
        this._opportunities.set(initialOpportunities);
        this.saveToStorage();
      }
    } catch {
      this._opportunities.set(initialOpportunities);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._opportunities()));
  }

  setFilterStatus(status: string): void {
    this._filterStatus.set(status);
  }

  setFilterType(type: string): void {
    this._filterType.set(type);
  }

  clearFilters(): void {
    this._filterStatus.set('');
    this._filterType.set('');
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setSortBy(field: 'createdAt' | 'updatedAt' | 'title' | 'company' | 'relevanceScore'): void {
    if (this._sortBy() === field) {
      this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      this._sortBy.set(field);
      this._sortOrder.set('desc');
    }
  }

  clearSearch(): void {
    this._searchTerm.set('');
  }

  add(opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
    const now = new Date().toISOString();
    const newOpportunity: Opportunity = {
      ...opportunity,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this._opportunities.update((list) => [newOpportunity, ...list]);
    this.saveToStorage();
    return newOpportunity;
  }

  update(id: string, changes: Partial<Opportunity>): Opportunity | null {
    let updated: Opportunity | null = null;
    this._opportunities.update((list) =>
      list.map((o) => {
        if (o.id === id) {
          updated = { ...o, ...changes, updatedAt: new Date().toISOString() };
          return updated;
        }
        return o;
      }),
    );
    if (updated) {
      this.saveToStorage();
    }
    return updated;
  }

  delete(id: string): void {
    this._opportunities.update((list) => list.filter((o) => o.id !== id));
    this.saveToStorage();
  }

  getById(id: string): Opportunity | undefined {
    return this._opportunities().find((o) => o.id === id);
  }

  importFromJson(jsonData: Opportunity[]): { added: number; updated: number; errors: string[] } {
    const errors: string[] = [];
    let added = 0;
    let updated = 0;

    for (const item of jsonData) {
      try {
        if (!item.title || !item.company) {
          errors.push(`Item ignorado: título ou empresa ausente`);
          continue;
        }

        const existing = this._opportunities().find(
          (o) => o.title === item.title && o.company === item.company,
        );

        const opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> = {
          title: item.title,
          company: item.company,
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          type: this.normalizeType(item.type),
          status: item.status || 'Nova',
          workMode: item.workMode,
          description: item.description,
          link: item.link,
          salary: item.salary,
          location: item.location,
          relevanceScore: item.relevanceScore,
        };

        if (existing) {
          this.update(existing.id, opportunityData);
          updated++;
        } else {
          this.add(opportunityData);
          added++;
        }
      } catch (e) {
        errors.push(`Erro ao processar item: ${e}`);
      }
    }

    return { added, updated, errors };
  }

  importFromCsv(csvText: string): { added: number; updated: number; errors: string[] } {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return { added: 0, updated: 0, errors: ['CSV vazio ou apenas cabeçalho'] };
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const data: Partial<Opportunity>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => (row[h] = values[idx] || ''));
      data.push(row as Partial<Opportunity>);
    }

    return this.importFromJson(data as Opportunity[]);
  }

  exportToJson(): string {
    return JSON.stringify(this._opportunities(), null, 2);
  }

  exportToCsv(): string {
    const opportunities = this._opportunities();
    if (opportunities.length === 0) return '';

    const headers = [
      'title',
      'company',
      'technologies',
      'type',
      'status',
      'workMode',
      'description',
      'link',
      'salary',
      'location',
      'relevanceScore',
      'createdAt',
      'updatedAt',
    ];

    const rows = opportunities.map((o) =>
      headers.map((h) => {
        const value = (o as unknown as Record<string, unknown>)[h];
        if (Array.isArray(value)) return `"${value.join('; ')}"`;
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
      }),
    );

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
