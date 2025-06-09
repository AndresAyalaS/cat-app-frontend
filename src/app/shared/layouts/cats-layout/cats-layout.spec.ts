import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatsLayout } from './cats-layout';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('CatsLayout', () => {
  let component: CatsLayout;
  let fixture: ComponentFixture<CatsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatsLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(CatsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the CatsLayout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Navbar component', () => {
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbar).toBeTruthy();
  });

  it('should render the RouterOutlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
