import React from "react";
import DeleteStudentConfirm from "./DeleteStudentConfirm";

describe("DeleteStudentConfirm Component", () => {
  const mockStudent = {
    id: "student_99",
    name: "Bad Student",
  };
  it("1. Renders warning message and buttons", () => {
    cy.mount(<DeleteStudentConfirm student={mockStudent} />);
    cy.contains("DELETE?").should("be.visible");
    cy.contains("Are you sure you want to delete this student?").should(
      "be.visible",
    );
    cy.contains("This action cannot be undone.").should("be.visible");
    cy.contains("button", "CANCEL").should("be.visible");
    cy.contains("button", "CONFIRM").should("be.visible");
  });
  it("2. Calls onCancel when CANCEL is clicked", () => {
    const onCancelSpy = cy.stub().as("cancelHandler");
    const onDeleteSpy = cy.stub().as("deleteHandler");

    cy.mount(
      <DeleteStudentConfirm
        student={mockStudent}
        onCancel={onCancelSpy}
        onDeleteStudent={onDeleteSpy}
      />,
    );
    cy.contains("button", "CANCEL").click();
    cy.get("@cancelHandler").should("have.been.called");
    cy.get("@deleteHandler").should("not.have.been.called");
  });
  it("3. Calls onDeleteStudent with correct ID and Name when CONFIRM is clicked", () => {
    const onCancelSpy = cy.stub().as("cancelHandler");
    const onDeleteSpy = cy.stub().as("deleteHandler");

    cy.mount(
      <DeleteStudentConfirm
        student={mockStudent}
        onCancel={onCancelSpy}
        onDeleteStudent={onDeleteSpy}
      />,
    );
    cy.contains("button", "CONFIRM").click();
    cy.get("@cancelHandler").should("not.have.been.called");
    cy.get("@deleteHandler").should(
      "have.been.calledWith",
      mockStudent.id,
      mockStudent.name,
    );
  });
});
