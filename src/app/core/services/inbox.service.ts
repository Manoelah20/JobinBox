import { Injectable, computed, inject, signal } from '@angular/core';
import type { OpportunityType } from './opportunity.service';
import { OpportunityService } from './opportunity.service';

import { RelevanceService } from './relevance.service';
export interface InboxMessage {
  id: string;
  subject: string;
  sender: string;
  content: string;

  //Tipo de Mensagem
  type: 'Vaga' | 'Curso' | 'Evento' | 'Outro';

  //Tipo identificado para oportunidade
  opportunityType?: OpportunityType;

  analyzed: boolean;
  createdAt: string;
}

export interface ExtractedOpportunity {
  title: string;
  company: string;
  technologies: string[];
  type: OpportunityType;
  status: string;
  workMode: string;
  description: string;
  link: string;
  salary: string;
  location: string;
  relevanceScore: number;
}

const STORAGE_KEY = 'jobinbox_messages';

const initialMessages: InboxMessage[] = [
  {
    id: '1',
    subject: 'Vaga Front-End Developer Jr',
    sender: 'recrutamento@empresaexemplo.com',
    content:
      'Olá! Encontramos seu perfil e temos uma oportunidade para Front-End Developer Jr. Procuramos profissionais com experiência em React, TypeScript e Next.js.',
    type: 'Vaga',
    analyzed: false,
    createdAt: '2026-08-23T10:30:00Z',
  },
  {
    id: '2',
    subject: 'Curso gratuito de React e TypeScript',
    sender: 'cursos@plataforma.com',
    content: 'Estão abertas as inscrições para o curso gratuito de React e TypeScript.',
    type: 'Curso',
    analyzed: false,
    createdAt: '2026-08-22T14:15:00Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private readonly opportunityService = inject(OpportunityService);

  private readonly relevanceService = inject(RelevanceService);

  private readonly _messages = signal<InboxMessage[]>([]);

  private readonly _selectedMessageId = signal<string | null>(null);

  private readonly _extractedOpportunity = signal<ExtractedOpportunity | null>(null);

  readonly messages = this._messages.asReadonly();

  readonly selectedMessageId = this._selectedMessageId.asReadonly();

  readonly extractedOpportunity = this._extractedOpportunity.asReadonly();

  readonly pendingCount = computed(
    () => this._messages().filter((message) => !message.analyzed).length,
  );

  readonly analyzedCount = computed(
    () => this._messages().filter((message) => message.analyzed).length,
  );

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as InboxMessage[];

        this._messages.set(parsed);
      } else {
        this._messages.set(initialMessages);
        this.saveToStorage();
      }
    } catch {
      this._messages.set(initialMessages);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._messages()));
  }

  analyze(id: string): void {
    const data = this.extractOpportunityData(id);

    if (!data) {
      return;
    }

    this._selectedMessageId.set(id);
    this._extractedOpportunity.set(data);
  }

  closeAnalysis(): void {
    this._selectedMessageId.set(null);
    this._extractedOpportunity.set(null);
  }
  updateExtractedOpportunity(updates: Partial<ExtractedOpportunity>): void {
    this._extractedOpportunity.update((opportunity) =>
      opportunity
        ? {
            ...opportunity,
            ...updates,
          }
        : null,
    );
  }

  updateTechnologies(technologies: string[]): void {
    this._extractedOpportunity.update((opportunity) =>
      opportunity
        ? {
            ...opportunity,
            technologies,
          }
        : null,
    );
  }

  addExtractedOpportunity(): void {
    const opportunity = this._extractedOpportunity();

    if (!opportunity) {
      return;
    }

    this.opportunityService.add({
      title: opportunity.title,
      company: opportunity.company,
      technologies: opportunity.technologies,
      type: opportunity.type,
      status: opportunity.status,
      workMode: opportunity.workMode,
      description: opportunity.description,
      link: opportunity.link,
      salary: opportunity.salary,
      location: opportunity.location,
      relevanceScore: opportunity.relevanceScore,
    });

    const messageId = this._selectedMessageId();

    if (messageId) {
      this.markAsAnalyzed(messageId, opportunity.type);
    }

    this.closeAnalysis();
  }

  add(message: Omit<InboxMessage, 'id' | 'createdAt' | 'analyzed'>): InboxMessage {
    const newMessage: InboxMessage = {
      ...message,
      id: crypto.randomUUID(),
      analyzed: false,
      createdAt: new Date().toISOString(),
    };

    this._messages.update((messages) => [newMessage, ...messages]);

    this.saveToStorage();

    return newMessage;
  }

  markAsAnalyzed(id: string, opportunityType?: OpportunityType): void {
    this._messages.update((messages) =>
      messages.map((message) =>
        message.id === id
          ? {
              ...message,
              analyzed: true,
              opportunityType: opportunityType ?? message.opportunityType,
            }
          : message,
      ),
    );

    this.saveToStorage();
  }

  delete(id: string): void {
    this._messages.update((messages) => messages.filter((message) => message.id !== id));

    this.saveToStorage();
  }

  getById(id: string): InboxMessage | undefined {
    return this._messages().find((message) => message.id === id);
  }

  extractOpportunityData(id: string): ExtractedOpportunity | null {
    const message = this.getById(id);

    if (!message) {
      return null;
    }

    const content = `${message.subject}\n${message.content}`;

    const technologies = [
      'React',
      'Angular',
      'Vue.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Python',
      'Java',
      'Docker',
      'AWS',
      'Flutter',
      'Dart',
      'RxJS',
      'MongoDB',
      'PostgreSQL',
      'MySQL',
    ].filter((technology) => content.toLowerCase().includes(technology.toLowerCase()));

    const workMode = this.extractWorkMode(content);

    const type = this.extractType(content, message.type);

    const salary = this.extractSalary(content);

    const location = this.extractLocation(content);

    const link = this.extractLink(content);

    const company = this.extractCompany(message.sender, content);

    const relevanceScore = this.relevanceService.calculate(content, technologies, type);

    return {
      title: message.subject,
      company,
      technologies,
      type,
      status: 'Nova',
      workMode,
      description: message.content,
      link,
      salary,
      location,
      relevanceScore,
    };
  }

  private extractType(content: string, messageType: InboxMessage['type']): OpportunityType {
    if (/estágio|estagio/i.test(content)) {
      return 'Estágio';
    }

    if (/trainee/i.test(content)) {
      return 'Trainee';
    }

    if (/\bPJ\b|pessoa jurídica|pessoa juridica/i.test(content)) {
      return 'PJ';
    }

    if (/\bCLT\b|carteira assinada/i.test(content)) {
      return 'CLT';
    }

    if (messageType === 'Curso') {
      return 'Curso';
    }

    if (messageType === 'Evento') {
      return 'Evento';
    }

    return 'Outro';
  }

  private extractWorkMode(content: string): string {
    if (/híbrid[ao]|hibrid[ao]|hybrid/i.test(content)) {
      return 'Híbrida';
    }

    if (/presencial|on-site|onsite|office/i.test(content)) {
      return 'Presencial';
    }

    if (/remota|remoto|home office|100%\s*remoto|100%\s*remote|remote/i.test(content)) {
      return 'Remota';
    }

    return 'Não informado';
  }

  private extractSalary(content: string): string {
    const patterns = [
      /R\$\s?[\d.]+(?:,\d{2})?(?:\s*(?:a|-)\s*R\$\s?[\d.]+(?:,\d{2})?)?/i,

      /salário\s*:?\s*R?\$?\s?[\d.]+(?:,\d{2})?(?:\s*(?:a|-)\s*R?\$?\s?[\d.]+(?:,\d{2})?)/i,

      /remuneração\s*:?\s*R?\$?\s?[\d.]+(?:,\d{2})?/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);

      if (match) {
        return match[0].trim();
      }
    }

    return '';
  }

  private extractLocation(content: string): string {
    const patterns = [
      /localização\s*:?\s*([^\n,.]+)/i,

      /local\s*:?\s*([^\n,.]+)/i,

      /em\s+([A-ZÁÀÃÂÉÊÍÓÔÕÚÇ][A-Za-zÁÀÃÂÉÊÍÓÔÕÚÇãáàâéêíóôõúç\s-]{2,30})/,

      /Rio de Janeiro/i,

      /São Paulo/i,

      /Belo Horizonte/i,

      /Brasília/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);

      if (match) {
        return match[1]?.trim() || match[0].trim();
      }
    }

    if (/remota|remoto|home office|100%\s*remoto/i.test(content)) {
      return 'Remoto';
    }

    return '';
  }

  private extractLink(content: string): string {
    const urlMatch = content.match(/https?:\/\/[^\s<>"']+/i);

    return urlMatch ? urlMatch[0].replace(/[.,;!?]+$/, '') : '';
  }
  private extractCompany(sender: string, content?: string): string {
    if (content) {
      const patterns = [
        /empresa\s*:?\s*([^\n,|]+)/i,
        /company\s*:?\s*([^\n,|]+)/i,
        /(?:na|no|da|do)\s+empresa\s+([^\n,|]+)/i,
      ];

      for (const pattern of patterns) {
        const match = content.match(pattern);

        if (match?.[1]) {
          return match[1].trim();
        }
      }
    }

    const emailMatch = sender.match(/@([^>\s]+)/);

    if (!emailMatch) {
      return sender;
    }

    const domain = emailMatch[1].replace(/^www\./, '').split('.')[0];

    return domain.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
