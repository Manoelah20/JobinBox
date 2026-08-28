import { TestBed } from '@angular/core/testing';
import { vi, beforeEach, describe, expect, it } from 'vitest';

import { Inbox } from './inbox';
import { InboxService, ExtractedOpportunity } from '../../core/services/inbox.service';
import { ToastService } from '../../core/services/toast.service';

describe('Inbox', () => {
  let component: Inbox;
  let inboxService: InboxService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: InboxService,
          useValue: {
            messages: vi.fn(() => [
              {
                id: '1',
                subject: 'Vaga Front-End',
                sender: 'a@b.com',
                content: 'React',
                type: 'Vaga',
                analyzed: false,
                createdAt: '2024-01-01',
                opportunityType: 'CLT',
              },
              {
                id: '2',
                subject: 'Curso React',
                sender: 'c@d.com',
                content: 'Curso',
                type: 'Curso',
                analyzed: true,
                createdAt: '2024-01-02',
                opportunityType: 'Curso',
              },
            ]),
            pendingCount: vi.fn(() => 1),
            analyzedCount: vi.fn(() => 1),
            selectedMessageId: vi.fn(() => null),
            extractedOpportunity: vi.fn(() => null),
            filteredOpportunities: vi.fn(() => []),
            analyze: vi.fn(),
            markAsAnalyzed: vi.fn(),
            delete: vi.fn(),
            closeAnalysis: vi.fn(),
            addExtractedOpportunity: vi.fn(),
            updateExtractedOpportunity: vi.fn(),
            updateTechnologies: vi.fn(),
          },
        },
        { provide: ToastService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    }).compileComponents();

    inboxService = TestBed.inject(InboxService);
    toastService = TestBed.inject(ToastService);

    // Use runInInjectionContext to create component with inject()
    component = TestBed.runInInjectionContext(() => new Inbox());
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose messages from the service', () => {
    expect(component['messages']()).toEqual(inboxService.messages());
  });

  it('should expose pending and analyzed counts', () => {
    expect(component['pendingCount']()).toBe(inboxService.pendingCount());
    expect(component['analyzedCount']()).toBe(inboxService.analyzedCount());
  });

  it('should expose the selected message id', () => {
    expect(component['selectedMessageId']()).toBe(inboxService.selectedMessageId());
  });

  it('should expose the extracted opportunity', () => {
    expect(component['extractedOpportunity']()).toBe(inboxService.extractedOpportunity());
  });

  it('should show all messages by default', () => {
    expect(component['filteredMessages']().length).toBe(inboxService.messages().length);
  });

  it('should filter pending messages', () => {
    component['statusFilter'].set('pending');
    expect(component['filteredMessages']().every((m) => !m.analyzed)).toBe(true);
  });

  it('should filter analyzed messages', () => {
    component['statusFilter'].set('analyzed');
    expect(component['filteredMessages']().every((m) => m.analyzed)).toBe(true);
  });

  it('should filter messages by message type', () => {
    component['typeFilter'].set('Curso');
    expect(component['filteredMessages']().every((m) => m.type === 'Curso')).toBe(true);
  });

  it('should filter messages by opportunity type', () => {
    component['opportunityTypeFilter'].set('CLT');
    expect(component['filteredMessages']().every((m) => m.opportunityType === 'CLT')).toBe(true);
  });

  it('should analyze a message', () => {
    const spy = vi.spyOn(inboxService, 'analyze');
    component['analyzeMessage']('1', new Event('click'));
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should mark a message as analyzed', () => {
    const spy = vi.spyOn(inboxService, 'markAsAnalyzed');
    component['markAsAnalyzed']('1', new Event('click'));
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should close the analysis', () => {
    const spy = vi.spyOn(inboxService, 'closeAnalysis');
    component['closeAnalysis']();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete a message after confirmation', () => {
    const spy = vi.spyOn(inboxService, 'delete');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component['deleteMessage']('1', new Event('click'));
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should not delete a message when confirmation is cancelled', () => {
    const spy = vi.spyOn(inboxService, 'delete');
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component['deleteMessage']('1', new Event('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update an opportunity field', () => {
    const spy = vi.spyOn(inboxService, 'updateExtractedOpportunity');
    component['updateOpportunityField']('title', 'Nova oportunidade');
    expect(spy).toHaveBeenCalledWith({ title: 'Nova oportunidade' });
  });

  it('should remove a technology', () => {
    const opportunity: ExtractedOpportunity = {
      technologies: ['React', 'TypeScript'],
      title: '',
      company: '',
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: '',
      link: '',
      salary: '',
      location: '',
      relevanceScore: 50,
    };
    vi.spyOn(inboxService, 'extractedOpportunity').mockReturnValue(opportunity);
    const spy = vi.spyOn(inboxService, 'updateTechnologies');
    component['removeTechnology']('React');
    expect(spy).toHaveBeenCalledWith(['TypeScript']);
  });

  it('should add a new technology', () => {
    const opportunity: ExtractedOpportunity = {
      technologies: ['React'],
      title: '',
      company: '',
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: '',
      link: '',
      salary: '',
      location: '',
      relevanceScore: 50,
    };
    vi.spyOn(inboxService, 'extractedOpportunity').mockReturnValue(opportunity);
    const spy = vi.spyOn(inboxService, 'updateTechnologies');
    const input = document.createElement('input');
    input.value = 'Docker';
    component['addTechnologyFromInput'](input);
    expect(spy).toHaveBeenCalledWith(['React', 'Docker']);
    expect(input.value).toBe('');
  });

  it('should not add an empty technology', () => {
    const spy = vi.spyOn(inboxService, 'updateTechnologies');
    const input = document.createElement('input');
    input.value = '   ';
    component['addTechnologyFromInput'](input);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not add a duplicated technology', () => {
    const opportunity: ExtractedOpportunity = {
      technologies: ['React'],
      title: '',
      company: '',
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: '',
      link: '',
      salary: '',
      location: '',
      relevanceScore: 50,
    };
    vi.spyOn(inboxService, 'extractedOpportunity').mockReturnValue(opportunity);
    const spy = vi.spyOn(inboxService, 'updateTechnologies');
    const input = document.createElement('input');
    input.value = 'React';
    component['addTechnologyFromInput'](input);
    expect(spy).not.toHaveBeenCalled();
    expect(input.value).toBe('');
  });

  it('should create an opportunity and show success toast', () => {
    const opportunity: ExtractedOpportunity = {
      title: 'Test',
      company: 'Co',
      technologies: [],
      type: 'CLT',
      status: 'Nova',
      workMode: 'Remota',
      description: '',
      link: '',
      salary: '',
      location: '',
      relevanceScore: 50,
    };
    vi.spyOn(inboxService, 'extractedOpportunity').mockReturnValue(opportunity);
    const addSpy = vi.spyOn(inboxService, 'addExtractedOpportunity');
    const toastSpy = vi.spyOn(toastService, 'success');
    component['createOpportunity']();
    expect(addSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith('Oportunidade adicionada com sucesso!');
  });

  it('should not create opportunity when extracted data is null', () => {
    vi.spyOn(inboxService, 'extractedOpportunity').mockReturnValue(null);
    const addSpy = vi.spyOn(inboxService, 'addExtractedOpportunity');
    component['createOpportunity']();
    expect(addSpy).not.toHaveBeenCalled();
  });
});
