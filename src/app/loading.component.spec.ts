/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent (inline template)', () => {

  let comp:    LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent ], // declare the test component
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);

    comp = fixture.componentInstance; // LoadingComponent test instance

    de = fixture.debugElement.query(By.css('spinner'));
    de = fixture.debugElement.children[0];
    el = de.nativeElement;
  });

  it('is a component', () => {
   // fixture.detectChanges();
   expect(comp).toBeTruthy();
  });

  it('has 5 children', () => {
    expect(de.children.length).toBe(5);
  });

  it('has a 3rd child with class of "rect3"', () => {
    expect(de.children[2].attributes['class']).toContain('rect');
  });

});
