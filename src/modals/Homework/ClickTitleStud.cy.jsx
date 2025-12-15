import React from "react";
import ClickTitleStud from "./ClickTitleStud";
const mockHomework = {
  id: 202,
  title: "React Basics",
  timeRemainingDisplay: "2 days 5 hours",
  description:
    "Please read the [Documentation](https://react.dev) and summarize it.",
  solution: "",
};

describe("ClickTitleStud Component", () => {
  it("1. Renders details and parses markdown links correctly", () => {
    cy.mount(<ClickTitleStud homework={mockHomework} />);
    cy.contains("h3", "React Basics").should("be.visible");
    cy.contains("Time remaining: 2 days 5 hours").should("be.visible");
    cy.contains("Please read the").should("be.visible");
    cy.get("a")
      .should("have.attr", "href", "https://react.dev")
      .and("have.attr", "target", "_blank")
      .and("contain", "Documentation");
  });
  it('2. Shows error when clicking "Mark as solved" with empty solution', () => {
    const onMarkSpy = cy.stub().as("markSolvedSpy");
    const setNotificationSpy = cy.stub().as("notifySpy");

    cy.mount(
      <ClickTitleStud
        homework={mockHomework}
        onMarkAsSolved={onMarkSpy}
        setNotification={setNotificationSpy}
      />,
    );
    cy.contains("button", "Mark as solved").click();
    cy.get("@markSolvedSpy").should("not.have.been.called");
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Please provide a solution before marking as solved!",
    );
  });

  it('3. Submits solution when "Mark as solved" is clicked', () => {
    const onMarkSpy = cy.stub().as("markSolvedSpy");
    const setNotificationSpy = cy.stub().as("notifySpy");
    const closeModalSpy = cy.stub().as("closeSpy");

    cy.mount(
      <ClickTitleStud
        homework={mockHomework}
        onMarkAsSolved={onMarkSpy}
        setNotification={setNotificationSpy}
        closeModal={closeModalSpy}
      />,
    );

    const myAnswer = "I read the docs, they are great.";
    cy.get("textarea").type(myAnswer);

    cy.contains("button", "Mark as solved").click();
    cy.get("@markSolvedSpy").should(
      "have.been.calledWith",
      mockHomework.id,
      myAnswer,
    );
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Homework marked as solved!",
    );
    cy.get("@closeSpy").should("have.been.called");
  });
  it('4. Calls onSaveProgress when "Save progress" is clicked', () => {
    const onSaveSpy = cy.stub().as("saveProgressSpy");
    const setNotificationSpy = cy.stub().as("notifySpy");

    cy.mount(
      <ClickTitleStud
        homework={mockHomework}
        onSaveProgress={onSaveSpy}
        setNotification={setNotificationSpy}
      />,
    );

    const draft = "Work in progress...";
    cy.get("textarea").type(draft);

    cy.contains("button", "Save progress").click();
    cy.get("@saveProgressSpy").should(
      "have.been.calledWith",
      mockHomework.id,
      draft,
    );
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Progress has been saved!",
    );
  });
  it("5. Pre-fills textarea if homework has existing solution", () => {
    const homeworkWithDraft = {
      ...mockHomework,
      solution: "My saved draft",
    };

    cy.mount(<ClickTitleStud homework={homeworkWithDraft} />);

    cy.get("textarea").should("have.value", "My saved draft");
  });
});
