import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputGroupDisplay } from './input-group-display.component';

describe('InputGroupDisplay', () => {
  let component: InputGroupDisplay;
  let fixture: ComponentFixture<InputGroupDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputGroupDisplay]
    }).compileComponents();

    fixture = TestBed.createComponent(InputGroupDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render group name in heading', () => {
    fixture.componentRef.setInput('group', 'Upstream');
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h3');
    expect(heading.textContent).toContain('Inputs for Upstream estimates');
  });

  it('should render entries for a generic input group', () => {
    fixture.componentRef.setInput('group', 'TestGroup');
    fixture.componentRef.setInput('inputGroup', { fooBar: 42, bazQux: 'hello' });
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Foo Bar:');
    expect(items[0].textContent).toContain('42');
    expect(items[1].textContent).toContain('Baz Qux:');
    expect(items[1].textContent).toContain('hello');
  });

  it('should render entries for a Cloud input group', () => {
    fixture.componentRef.setInput('group', 'Cloud');
    fixture.componentRef.setInput('inputGroup', {
      monthlyCloudBill: { min: 100, max: 200 },
      cloudPercentage: 50,
      cloudLocation: 'UK',
      noCloudServices: false
    });
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(5);
    expect(items[0].textContent).toContain('Min Cloud Bill');
    expect(items[0].textContent).toMatch(/£100\.00/);
    expect(items[1].textContent).toContain('Max Cloud Bill');
    expect(items[1].textContent).toMatch(/£200\.00/);
    expect(items[2].textContent).toContain('Cloud Percentage');
    expect(items[2].textContent).toContain('50%');
    expect(items[3].textContent).toContain('Cloud Location');
    expect(items[3].textContent).toContain('UK');
    expect(items[4].textContent).toContain('No Cloud Services');
    expect(items[4].textContent).toContain('false');
  });

  it('should handle empty inputGroup gracefully', () => {
    fixture.componentRef.setInput('group', 'Empty');
    fixture.componentRef.setInput('inputGroup', {});
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(0);
  });

  it('should handle undefined inputGroup gracefully', () => {
    fixture.componentRef.setInput('group', 'Undefined');
    fixture.componentRef.setInput('inputGroup', undefined);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(0);
  });

  it('should format keys with spaces and capitalization for generic input', () => {
    fixture.componentRef.setInput('group', 'TestGroup');
    fixture.componentRef.setInput('inputGroup', { someTestKey: 1 });
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector('li');
    expect(item.textContent).toContain('Some Test Key:');
  });

  it('should display boolean values as "true" or "false"', () => {
    fixture.componentRef.setInput('group', 'TestGroup');
    fixture.componentRef.setInput('inputGroup', { isEnabled: true, isDisabled: false });
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items[0].textContent).toContain('true');
    expect(items[1].textContent).toContain('false');
  });
});
