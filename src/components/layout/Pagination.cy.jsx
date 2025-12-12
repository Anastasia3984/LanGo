import React from "react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  it("1. Renders correctly on the first page (Prev button disabled)", () => {
    cy.mount(<Pagination currentPage={1} totalPages={10} />);
    cy.contains("div", "1").should("be.visible");
    cy.contains("button", "←").should("be.disabled");
    cy.contains("button", "→").should("not.be.disabled");
  });
  it("2. Renders correctly on the last page (Next button disabled)", () => {
    cy.mount(<Pagination currentPage={5} totalPages={5} />);
    cy.contains("div", "5").should("be.visible");
    cy.contains("button", "←").should("not.be.disabled");
    cy.contains("button", "→").should("be.disabled");
  });
  it("3. Calls onPageChange with (currentPage + 1) when Next is clicked", () => {
    const changeStub = cy.stub().as("changeHandler");
    const currentPage = 3;

    cy.mount(
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={changeStub}
      />,
    );
    cy.contains("button", "→").click();
    cy.get("@changeHandler").should("have.been.calledWith", 4);
  });
  it("4. Calls onPageChange with (currentPage - 1) when Prev is clicked", () => {
    const changeStub = cy.stub().as("changeHandler");
    const currentPage = 8;

    cy.mount(
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={changeStub}
      />,
    );
    cy.contains("button", "←").click();
    cy.get("@changeHandler").should("have.been.calledWith", 7);
  });
  it("5. Does NOT call onPageChange when clicking a disabled button", () => {
    const changeStub = cy.stub().as("changeHandler");
    cy.mount(
      <Pagination currentPage={1} totalPages={5} onPageChange={changeStub} />,
    );
    cy.contains("button", "←").click({ force: true });
    cy.get("@changeHandler").should("not.have.been.called");
  });
});
