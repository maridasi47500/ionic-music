import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourUrlHerePage } from './your-url-here.page';

describe('YourUrlHerePage', () => {
  let component: YourUrlHerePage;
  let fixture: ComponentFixture<YourUrlHerePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(YourUrlHerePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
