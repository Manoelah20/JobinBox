import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InboxMessage, InboxService } from './inbox.service';
import { OpportunityService } from './opportunity.service';
import { RelevanceService } from './relevance.service';

describe('InboxService', () => {
  let service: InboxService;
  let opportunityService: OpportunityService;
  let relevanceService: RelevanceService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [InboxService, OpportunityService, RelevanceService],
    });

    service = TestBed.inject(InboxService);
    opportunityService = TestBed.inject(OpportunityService);
    relevanceService = TestBed.inject(RelevanceService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial messages when storage is empty', () => {
    expect(service.messages().length).toBe(2);
  });

  it('should find a message by id', () => {
    expect(service.getById('1')).toBeDefined();
  });

  it('should return undefined when message does not exist', () => {
    expect(service.getById('999')).toBeUndefined();
  });

  it('should add a new message', () => {
    const message = service.add({
      subject: 'Nova vaga',
      sender: 'empresa@example.com',
      content: 'Vaga Front-End',
      type: 'Vaga',
    });

    expect(message.id).toBeTruthy();
    expect(service.getById(message.id)).toBeDefined();
  });

  it('should persist a new message in localStorage', () => {
    service.add({
      subject: 'Nova vaga',
      sender: 'empresa@example.com',
      content: 'Vaga Front-End',
      type: 'Vaga',
    });

    const stored = JSON.parse(localStorage.getItem('jobinbox_messages') ?? '[]') as InboxMessage[];

    expect(stored.length).toBe(3);
  });

  it('should mark a message as analyzed', () => {
    service.markAsAnalyzed('1', 'CLT');

    expect(service.getById('1')?.analyzed).toBe(true);
    expect(service.getById('1')?.opportunityType).toBe('CLT');
  });

  it('should preserve the existing opportunity type when none is provided', () => {
    service.markAsAnalyzed('1', 'PJ');
    service.markAsAnalyzed('1');

    expect(service.getById('1')?.opportunityType).toBe('PJ');
  });

  it('should persist the analyzed state in localStorage', () => {
    service.markAsAnalyzed('1');

    const stored = JSON.parse(localStorage.getItem('jobinbox_messages') ?? '[]') as InboxMessage[];

    expect(stored.find((message) => message.id === '1')?.analyzed).toBe(true);
  });

  it('should delete a message', () => {
    service.delete('1');

    expect(service.getById('1')).toBeUndefined();
  });

  it('should persist the deletion in localStorage', () => {
    service.delete('1');

    const stored = JSON.parse(localStorage.getItem('jobinbox_messages') ?? '[]') as InboxMessage[];

    expect(stored.some((message) => message.id === '1')).toBe(false);
  });

  it('should not change anything when deleting an unknown message', () => {
    const before = service.messages().length;

    service.delete('999');

    expect(service.messages().length).toBe(before);
  });

  describe('extractOpportunityData', () => {
    it('should return null when the message does not exist', () => {
      expect(service.extractOpportunityData('999')).toBeNull();
    });

    it('should extract the title from the message subject', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.title).toBe('Vaga Front-End Developer Jr');
    });

    it('should extract frontend technologies', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.technologies).toEqual(
        expect.arrayContaining(['React', 'TypeScript', 'Next.js']),
      );
    });

    it('should extract the opportunity type as Outro when the message does not identify a supported type', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.type).toBe('Outro');
    });

    it('should extract CLT opportunities', () => {
      const message = service.add({
        subject: 'Vaga Front-End CLT',
        sender: 'empresa@example.com',
        content: 'Oportunidade CLT para desenvolvedor Front-End.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('CLT');
    });

    it('should extract PJ opportunities', () => {
      const message = service.add({
        subject: 'Vaga Front-End PJ',
        sender: 'empresa@example.com',
        content: 'Oportunidade PJ para desenvolvedor.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('PJ');
    });

    it('should extract Estágio opportunities', () => {
      const message = service.add({
        subject: 'Estágio Front-End',
        sender: 'empresa@example.com',
        content: 'Vaga de estágio para desenvolvedor Front-End.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('Estágio');
    });

    it('should extract Trainee opportunities', () => {
      const message = service.add({
        subject: 'Programa Trainee',
        sender: 'empresa@example.com',
        content: 'Programa trainee para desenvolvedores.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('Trainee');
    });

    it('should extract Curso opportunities from the message type', () => {
      const message = service.add({
        subject: 'Curso de React',
        sender: 'cursos@example.com',
        content: 'Curso gratuito de React.',
        type: 'Curso',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('Curso');
    });

    it('should extract Evento opportunities from the message type', () => {
      const message = service.add({
        subject: 'Evento de tecnologia',
        sender: 'eventos@example.com',
        content: 'Evento sobre tecnologia.',
        type: 'Evento',
      });

      expect(service.extractOpportunityData(message.id)?.type).toBe('Evento');
    });

    it('should extract remote work mode', () => {
      const message = service.add({
        subject: 'Vaga remota',
        sender: 'empresa@example.com',
        content: 'Trabalho remoto e home office.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.workMode).toBe('Remota');
    });

    it('should extract hybrid work mode', () => {
      const message = service.add({
        subject: 'Vaga híbrida',
        sender: 'empresa@example.com',
        content: 'Modelo híbrido.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.workMode).toBe('Híbrida');
    });

    it('should extract onsite work mode', () => {
      const message = service.add({
        subject: 'Vaga presencial',
        sender: 'empresa@example.com',
        content: 'Trabalho presencial no escritório.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.workMode).toBe('Presencial');
    });

    it('should return Não informado when work mode is not found', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Oportunidade para desenvolvedor.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.workMode).toBe('Não informado');
    });

    it('should extract salary in Brazilian currency format', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Salário R$ 5.000,00.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.salary).toBe('R$ 5.000,00');
    });

    it('should extract salary ranges', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Faixa salarial R$ 5.000,00 a R$ 7.000,00.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.salary).toContain(
        'R$ 5.000,00 a R$ 7.000,00',
      );
    });

    it('should return an empty salary when it is not informed', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Oportunidade sem salário informado.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.salary).toBe('');
    });

    it('should extract a URL from the message', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Candidate-se em https://example.com/vaga.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.link).toBe('https://example.com/vaga');
    });

    it('should return an empty link when no URL is present', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Sem link.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.link).toBe('');
    });

    it('should extract the company from explicit company information', () => {
      const message = service.add({
        subject: 'Vaga Front-End',
        sender: 'recrutamento@example.com',
        content: 'Empresa: Tech Solutions. Estamos contratando um desenvolvedor Front-End.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.company).toBe('Tech Solutions');
    });

    it('should extract the company from the sender domain when company is not informed', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'recrutamento@tech-solutions.com',
        content: 'Vaga para desenvolvedor.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.company).toBe('Tech Solutions');
    });

    it('should use the sender when it does not contain a valid email domain', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'Recrutamento',
        content: 'Vaga para desenvolvedor.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.company).toBe('Recrutamento');
    });

    it('should extract the location from explicit location information', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Localização: Rio de Janeiro.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.location).toBe('Rio de Janeiro');
    });

    it('should extract São Paulo as a known location', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Oportunidade em São Paulo.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.location).toBe('São Paulo');
    });

    it('should use Remoto as location when the opportunity is remote and no location was found', () => {
      const message = service.add({
        subject: 'Vaga remota',
        sender: 'empresa@example.com',
        content: 'Trabalho 100% remoto.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.location).toBe('Remoto');
    });

    it('should return an empty location when it cannot identify one', () => {
      const message = service.add({
        subject: 'Vaga',
        sender: 'empresa@example.com',
        content: 'Oportunidade para desenvolvedor.',
        type: 'Vaga',
      });

      expect(service.extractOpportunityData(message.id)?.location).toBe('');
    });

    it('should set the extracted opportunity status to Nova', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.status).toBe('Nova');
    });

    it('should use the message content as the opportunity description', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.description).toContain('Encontramos seu perfil');
    });

    it('should calculate a relevance score', () => {
      const result = service.extractOpportunityData('1');

      expect(result?.relevanceScore).toBeGreaterThan(0);
      expect(result?.relevanceScore).toBeLessThanOrEqual(100);
    });

    it('should update the extracted opportunity', () => {
      service.analyze('1');

      service.updateExtractedOpportunity({
        title: 'Título atualizado',
        company: 'Empresa atualizada',
      });

      expect(service.extractedOpportunity()?.title).toBe('Título atualizado');
      expect(service.extractedOpportunity()?.company).toBe('Empresa atualizada');
    });

    it('should update extracted technologies', () => {
      service.analyze('1');

      service.updateTechnologies(['React', 'Docker']);

      expect(service.extractedOpportunity()?.technologies).toEqual(['React', 'Docker']);
    });

    it('should add an extracted opportunity to OpportunityService', () => {
      service.analyze('1');

      const addSpy = vi.spyOn(opportunityService, 'add');

      service.addExtractedOpportunity();

      expect(addSpy).toHaveBeenCalled();
    });

    it('should mark the message as analyzed after adding the opportunity', () => {
      service.analyze('1');

      service.addExtractedOpportunity();

      expect(service.getById('1')?.analyzed).toBe(true);
    });

    it('should close the analysis after adding the opportunity', () => {
      service.analyze('1');

      service.addExtractedOpportunity();

      expect(service.selectedMessageId()).toBeNull();
      expect(service.extractedOpportunity()).toBeNull();
    });

    it('should do nothing when adding an opportunity without extracted data', () => {
      const addSpy = vi.spyOn(opportunityService, 'add');

      service.addExtractedOpportunity();

      expect(addSpy).not.toHaveBeenCalled();
    });

    it('should close the analysis and clear extracted data', () => {
      service.analyze('1');

      expect(service.selectedMessageId()).toBe('1');
      expect(service.extractedOpportunity()).not.toBeNull();

      service.closeAnalysis();

      expect(service.selectedMessageId()).toBeNull();
      expect(service.extractedOpportunity()).toBeNull();
    });

    it('should not analyze an unknown message', () => {
      service.analyze('999');

      expect(service.selectedMessageId()).toBeNull();
      expect(service.extractedOpportunity()).toBeNull();
    });

    it('should calculate relevance using RelevanceService', () => {
      const calculateSpy = vi.spyOn(relevanceService, 'calculate');

      service.extractOpportunityData('1');

      expect(calculateSpy).toHaveBeenCalled();
    });
  });
});
