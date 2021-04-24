import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });
  fixture.detectChanges();

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("add", () => {
    component.crud.isCreate = true;
    component.add();
    expect(component.crud.isCreate).toBeTruthy();
  });

  it("getData", () => {
    const data = {
      id: 1,
      name: "Dharman",
      technology: "Angular",
      company: "Amazon"
    };
    const label = "name";
    expect(component.getData(data, label)).toEqual(data["name"]);
    expect(component.getData(data, "technology")).toEqual(data["technology"]);
  });

  it("edit", () => {
    const data = {
      id: 1,
      name: "Dharman",
      technology: "Angular",
      company: "Amazon"
    };
    component.crud.isUpdate = true;
    component.crud.updateData = data;
    component.edit(data);
    expect(component.crud.isUpdate).toBeTruthy();
  });
  it("cancel", () => {
    component.cancel();
    expect(component.crud.updateData).toEqual(null);
  });

  it("create", () => {
    const data = {
      id: 1,
      name: "Dharman",
      technology: "Angular",
      company: "Amazon"
    };
    component.createForm.controls["id"].setValue(data.id);
    component.createForm.controls["name"].setValue(data.name);
    component.createForm.controls["technology"].setValue(data.technology);
    component.createForm.controls["company"].setValue(data.company);
    component.crud.isCreate = false;
    fixture.detectChanges();
    component.create();
    expect(component.createForm.value).toEqual({ name: "Dharman" });
    expect(component.createForm.valid).toBeTruthy();
    component.create();
    expect(component.createForm.valid).toBeTruthy();
  });
});
