import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpportunityService } from '../../core/services/opportunity.service';

describe('Dashboard (service integration)', () => {
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

  it('should have required computed signals', () => {
    expect(opportunityService.totalCount).toBeDefined();
    expect(opportunityService.newCount).toBeDefined();
    expect(opportunityService.inProgressCount).toBeDefined();
  });
});
