import React from "react";
import { CloseButton } from "./CloseButton";

describe("CloseButton Component", () => {
  it("1. Renders the button and displays the close symbol", () => {
    cy.mount(<CloseButton />);
    cy.get("button").should("exist");
    cy.get("button").should("contain", "×");
  });
  it("2. Calls the onClick handler when clicked", () => {
    const clickStub = cy.stub().as("clickSpy");
    cy.mount(<CloseButton onClick={clickStub} />);
    cy.get("button").click();
    cy.get("@clickSpy").should("have.been.calledOnce");
  });
  it("3. Includes the correct aria-label for accessibility", () => {
    cy.mount(<CloseButton onClick={() => {}} />);
    cy.get("button").should("have.attr", "aria-label", "Close modal");
  });
  it("4. Applies the custom className", () => {
    const customClass = "test-modal-exit";

    cy.mount(<CloseButton className={customClass} />);
    cy.get("button").should("have.class", customClass);
  });
});
