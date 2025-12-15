import React from "react";
import Button from "./Button";

describe("Button Component", () => {
  it("1. Renders with correct children (text)", () => {
    const buttonText = "Submit Form";
    cy.mount(<Button>{buttonText}</Button>);
    cy.get("button").should("contain", buttonText).and("be.visible");
  });
  it("2. Calls the onClick handler when clicked", () => {
    const clickStub = cy.stub().as("clickAction");

    cy.mount(<Button onClick={clickStub}>Click Me</Button>);

    cy.get("button").click();
    cy.get("@clickAction").should("have.been.calledOnce");
  });
  it("3. Is disabled and cannot be clicked when disabled prop is true", () => {
    const clickStub = cy.stub().as("clickAction");

    cy.mount(
      <Button onClick={clickStub} disabled={true}>
        Disabled
      </Button>,
    );
    cy.get("button").should("be.disabled");
    cy.get("button").click({ force: true });
    cy.get("@clickAction").should("not.have.been.called");
  });
  it('4. Has default type="button" to prevent form submission', () => {
    cy.mount(<Button>Default</Button>);

    cy.get("button").should("have.attr", "type", "button");
  });
});
