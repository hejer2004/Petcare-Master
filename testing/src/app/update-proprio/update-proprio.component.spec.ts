import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProprioComponent } from './update-proprio.component';

describe('UpdateProprioComponent', () => {
  let component: UpdateProprioComponent;
  let fixture: ComponentFixture<UpdateProprioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProprioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProprioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
