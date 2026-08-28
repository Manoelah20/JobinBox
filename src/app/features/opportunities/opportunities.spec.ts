import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpportunityService } from '../../core/services/opportunity.service';

describe('Opportunities (service integration)', () => {
  let opportunityService: OpportunityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [OpportunityService, provideRouter([])],
    }).compileComponents();

    opportunityService = TestBed.inject(OpportunityService);
  });

  it('should have OpportunityService available', () => {
    expect(opportunityService).toBeTruthy();
  });

  it('should have filter signals', () => {
    expect(opportunityService.filterStatus).toBeDefined();
    expect(opportunityService.filterType).toBeDefined();
    expect(opportunityService.filteredOpportunities).toBeDefined();
  });

  it('should have statuses and types', () => {
    expect(opportunityService.statuses).toBeDefined();
    expect(opportunityService.types).toBeDefined();
    expect(opportunityService.workModes).toBeDefined();
  });
});
