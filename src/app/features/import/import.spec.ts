import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpportunityService } from '../../core/services/opportunity.service';

describe('Import (service integration)', () => {
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

  it('should have import methods', () => {
    expect(typeof opportunityService.importFromJson).toBe('function');
    expect(typeof opportunityService.importFromCsv).toBe('function');
    expect(typeof opportunityService.exportToJson).toBe('function');
    expect(typeof opportunityService.exportToCsv).toBe('function');
  });
});
