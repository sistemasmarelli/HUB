import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendProdComponent } from './pendProd.component';

describe('PendProdComponent', () => {
  let component: PendProdComponent;
  let fixture: ComponentFixture<PendProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
