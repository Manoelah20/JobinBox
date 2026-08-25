import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OpportunityService } from '../../core/services/opportunity.service';
import { Import } from './import';

describe('Import', () => {
  let component: Import;
  let fixture: ComponentFixture<Import>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Import],
      providers: [OpportunityService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Import);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});