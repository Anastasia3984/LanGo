import React from "react";
import CheckHW from "./CheckHW";
const mockHomework = {
  id: 101,
  title: "Past Simple Verbs",
  description: "Convert the list of verbs to Past Simple.",
  solution: "go -> went, see -> saw, do -> did",
  comment: "",
};

describe("CheckHW Component", () => {
  it("1. Renders homework details correctly", () => {
    cy.mount(<CheckHW homework={mockHomework} />);
    cy.contains("h2", "Homework").should("be.visible");
    cy.contains("h3", mockHomework.title).should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains(mockHomework.description).should("be.visible");

    cy.contains("Solution").should("be.visible");
    cy.contains(mockHomework.solution).should("be.visible");
    cy.get("textarea").should("be.visible");
    cy.get("button").contains("Mark as checked").should("be.visible");
  });

  it("2. Allows typing comment and calls handlers on submit", () => {
    const onMarkAsCheckedSpy = cy.stub().as("markCheckedSpy");
    const closeModalSpy = cy.stub().as("closeModalSpy");
    const setNotificationSpy = cy.stub().as("notifySpy");

    cy.mount(
      <CheckHW
        homework={mockHomework}
        onMarkAsChecked={onMarkAsCheckedSpy}
        closeModal={closeModalSpy}
        setNotification={setNotificationSpy}
      />,
    );

    const teacherFeedback = "Great job! No mistakes found.";
    cy.get("textarea").type(teacherFeedback);
    cy.get("textarea").should("have.value", teacherFeedback);
    cy.get("button").contains("Mark as checked").click();
    cy.get("@markCheckedSpy").should(
      "have.been.calledWith",
      mockHomework.id,
      teacherFeedback,
    );
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Homework marked as checked!",
    );
    cy.get("@closeModalSpy").should("have.been.called");
  });

  it("3. Pre-fills comment if homework already has one", () => {
    const homeworkWithComment = {
      ...mockHomework,
      comment: "Please correct the second sentence.",
    };

    cy.mount(<CheckHW homework={homeworkWithComment} />);

    cy.get("textarea").should(
      "have.value",
      "Please correct the second sentence.",
    );
  });
  it("4. Does not crash if optional callbacks are missing", () => {
    cy.mount(<CheckHW homework={mockHomework} onMarkAsChecked={cy.stub()} />);
    cy.get("textarea").type("Test comment");
    cy.get("button").contains("Mark as checked").click();
    cy.get("button").should("be.visible");
  });
});
