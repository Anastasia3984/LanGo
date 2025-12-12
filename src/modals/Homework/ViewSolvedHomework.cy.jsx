import React from "react";
import ViewSolvedHomework from "./ViewSolvedHomework";

describe("ViewSolvedHomework Component", () => {
  it("1. Renders correctly with full homework data", () => {
    const mockHomework = {
      title: "Past Perfect Tense",
      description: "Fill in the blanks with had + V3",
      solution: "1. had gone, 2. had seen",
      comment: "Good job, but watch out for irregular verbs!",
    };

    cy.mount(<ViewSolvedHomework homework={mockHomework} />);
    cy.contains("h3", "Past Perfect Tense").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Fill in the blanks with had + V3").should("be.visible");
    cy.contains("Solution").should("be.visible");
    cy.contains("1. had gone, 2. had seen").should("be.visible");
    cy.contains("Comment").should("be.visible");
    cy.contains("Good job, but watch out for irregular verbs!").should(
      "be.visible",
    );
  });
  it("2. Renders default text when homework data is missing", () => {
    cy.mount(<ViewSolvedHomework homework={{}} />);
    cy.contains("h3", "Title").should("be.visible");
    cy.contains("No description provided").should("be.visible");
    cy.contains("No solution provided").should("be.visible");
    cy.contains("No comment from teacher yet").should("be.visible");
  });
  it("3. Renders partial data correctly", () => {
    const partialHomework = {
      title: "Essay",
      solution: "My essay text...",
    };

    cy.mount(<ViewSolvedHomework homework={partialHomework} />);

    cy.contains("h3", "Essay").should("be.visible");
    cy.contains("My essay text...").should("be.visible");
    cy.contains("No description provided").should("be.visible");
    cy.contains("No comment from teacher yet").should("be.visible");
  });
});
