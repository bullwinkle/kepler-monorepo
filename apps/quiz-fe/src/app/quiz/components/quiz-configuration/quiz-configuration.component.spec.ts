import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizConfigurationComponent } from './quiz-configuration.component';

describe('QuizConfigurationComponent', () => {
  let component: QuizConfigurationComponent;
  let fixture: ComponentFixture<QuizConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QuizConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
