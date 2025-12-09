import React from "react";
import LinkableTextArea from "./LinkableTextArea";

describe("LinkableTextArea Component", () => {
  it("1. Renders textarea and toolbar button correctly", () => {
    const placeholder = "Enter description...";
    cy.mount(<LinkableTextArea placeholder={placeholder} />);
    cy.get("button").contains("🔗 Add Link").should("be.visible");
    cy.get("textarea").should("have.attr", "placeholder", placeholder);
  });

  it("2. Does NOT open dialog if no text is selected", () => {
    cy.window().then((win) => cy.spy(win.console, "warn").as("consoleWarn"));
    cy.mount(<LinkableTextArea value="Some text" />);
    cy.get("button").contains("🔗 Add Link").click();
    cy.contains("h3", "Add Link").should("not.exist");
    cy.get("@consoleWarn").should(
      "be.calledWith",
      "Please select text first to add a link!",
    );
  });

  it("3. Opens dialog on selection, accepts URL, and formats output", () => {
    const onChangeStub = cy.stub().as("onChangeHandler");
    cy.mount(
      <LinkableTextArea value="Visit Google now" onChange={onChangeStub} />,
    );
    cy.get("textarea").then(($el) => {
      $el[0].setSelectionRange(6, 12);
    });
    cy.get("button").contains("🔗 Add Link").click();
    cy.get('input[type="url"]').type("google.com");
    cy.get('div[class*="linkDialog"] button').contains("Add").click();
    cy.get("@onChangeHandler").should("have.been.calledWithMatch", {
      target: { value: "Visit [Google](https://google.com) now" },
    });
  });

  it("4. Closes dialog without changes when Cancel is clicked", () => {
    const onChangeStub = cy.stub().as("onChangeHandler");
    cy.mount(<LinkableTextArea value="Click me" onChange={onChangeStub} />);

    cy.get("textarea").then(($el) => $el[0].setSelectionRange(0, 5));
    cy.get("button").contains("🔗 Add Link").click();
    cy.get("button").contains("Cancel").click();

    cy.contains("h3", "Add Link").should("not.exist");
    cy.get("@onChangeHandler").should("not.have.been.called");
  });

  it("5. Does not double-add https:// if user types it manually", () => {
    const onChangeStub = cy.stub().as("onChangeHandler");
    cy.mount(<LinkableTextArea value="Link here" onChange={onChangeStub} />);

    cy.get("textarea").then(($el) => $el[0].setSelectionRange(0, 4));
    cy.get("button").contains("🔗 Add Link").click();

    cy.get('input[type="url"]').type("https://mysite.com");
    cy.get('div[class*="linkDialog"] button').contains("Add").click();

    cy.get("@onChangeHandler").should("have.been.calledWithMatch", {
      target: { value: "[Link](https://mysite.com) here" },
    });
  });
});
