import React from "react";
import TextArea from "./TextArea";

describe("TextArea Component", () => {
  it("1. Renders correctly with placeholder", () => {
    const placeholderText = "Write your essay here...";

    cy.mount(<TextArea placeholder={placeholderText} />);
    cy.get("textarea").should("exist");
    cy.get("textarea").should("have.attr", "placeholder", placeholderText);
  });
  it("2. Updates value on typing and triggers onChange handler", () => {
    const changeStub = cy.stub().as("changeHandler");
    const textToType = "Learning English with LanGo is fun!";
    cy.mount(<TextArea onChange={changeStub} />);
    cy.get("textarea").type(textToType);
    cy.get("@changeHandler").should("be.called");
    cy.get("textarea").should("have.value", textToType);
  });
  it("3. Merges default styles with custom className", () => {
    const customClass = "error-border";
    cy.mount(<TextArea className={customClass} />);
    cy.get("textarea").should("have.class", customClass);
  });
  it("4. Renders as disabled and prevents interaction", () => {
    const changeStub = cy.stub().as("changeHandler");
    cy.mount(<TextArea disabled={true} value="" onChange={changeStub} />);
    cy.get("textarea").should("be.disabled");
    cy.get("textarea").type("Should not work", { force: true });
    cy.get("textarea").should("have.value", "");
  });
  it("5. Passes through standard HTML attributes (e.g., rows, maxLength)", () => {
    cy.mount(<TextArea rows={10} maxLength={50} />);
    cy.get("textarea").should("have.attr", "rows", "10");
    cy.get("textarea").should("have.attr", "maxLength", "50");
  });
});
