import React from "react";
import InputField from "./InputField";

describe("InputField Component", () => {
  it('1. Renders correctly with placeholder and type="text"', () => {
    cy.mount(<InputField placeholder="Enter your name" type="text" />);

    cy.get("input").should("exist");
    cy.get("input").should("have.attr", "placeholder", "Enter your name");
    cy.get("input").should("have.attr", "type", "text");
  });
  it("2. Calls onChange handler and reports the new value", () => {
    const changeStub = cy.stub().as("changeHandler");
    cy.mount(<InputField onChange={changeStub} />);

    const newValue = "test@lango.com";

    cy.get("input").type(newValue);
    cy.get("@changeHandler").should("be.called");
    cy.get("input").should("have.value", newValue);
  });
  it("3. Renders as disabled and prevents value change when forced input occurs", () => {
    const changeStub = cy.stub().as("changeHandler");
    const initialValue = "Недоторканний текст";
    cy.mount(
      <InputField disabled={true} value={initialValue} onChange={changeStub} />,
    );
    cy.get("input").should("be.disabled");
    cy.get("input").type("attempted text", { log: false, force: true });
    cy.get("@changeHandler").should("be.called");
    cy.get("input").should("have.value", initialValue);
  });
  it('4. Uses type="password" to obscure input', () => {
    const password = "mysecretpassword123";
    cy.mount(<InputField type="password" />);

    cy.get("input").type(password);

    cy.get("input").should("have.attr", "type", "password");
    cy.get("input").should("have.value", password);
  });
});
