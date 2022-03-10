import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypePersonPage } from './type-person.page';


describe('TypePersonPage', () => {
  let component: TypePersonPage;
  let fixture: ComponentFixture<TypePersonPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePersonPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
