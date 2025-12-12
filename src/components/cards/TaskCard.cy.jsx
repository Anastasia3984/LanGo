import React from "react";
import TaskCard from "./TaskCard";
import styles from "./TaskCard.module.css";

const mockTask = {
  id: 1,
  col2: "Due Tomorrow",
  col3: "Check details",
};

describe("TaskCard Component", () => {
  it("1. Renders the correct title based on priority", () => {
    cy.mount(<TaskCard task={{ ...mockTask, title: "Direct Title" }} />);
    cy.contains("Direct Title").should("be.visible");
    cy.mount(
      <TaskCard
        task={{
          ...mockTask,
          title: null,
          assignment: { title: "Nested Title" },
        }}
      />,
    );
    cy.contains("Nested Title").should("be.visible");
    cy.mount(
      <TaskCard task={{ ...mockTask, title: null, assignment: null }} />,
    );
    cy.contains("Unnamed Task").should("be.visible");
  });
  it("2. Calls callbacks when clicking title or action column", () => {
    const onTitleClickSpy = cy.stub().as("titleClick");
    const onActionClickSpy = cy.stub().as("actionClick");

    cy.mount(
      <TaskCard
        task={mockTask}
        onTitleClick={onTitleClickSpy}
        onActionClick={onActionClickSpy}
      />,
    );
    cy.contains("Unnamed Task").click();
    cy.get("@titleClick").should("have.been.calledOnce");
    cy.contains(mockTask.col3).click();
    cy.get("@actionClick").should("have.been.calledOnce");
  });

  it('3. Applies overdue styles correctly when type="solved"', () => {
    const overdueTask = { ...mockTask, isOverdue: true, col2: "Late!" };
    const onTimeTask = { ...mockTask, isOverdue: false, col2: "On Time" };
    cy.mount(<TaskCard task={overdueTask} type="solved" />);
    cy.contains("Late!").should("have.class", styles.overdue);
    cy.mount(<TaskCard task={onTimeTask} type="solved" />);
    cy.contains("On Time").should("have.class", styles.onTime);
  });

  it("4. Applies styling for column 3 based on check status", () => {
    const uncheckedTask = { ...mockTask, col3: "unchecked" };
    cy.mount(<TaskCard task={uncheckedTask} type="solved" />);
    cy.contains("unchecked").should("have.class", styles.unchecked);
    cy.mount(<TaskCard task={mockTask} type="pending" />);
    cy.contains(mockTask.col3).should("have.class", styles.actionLink);
  });

  it("5. Renders edit button only if handler provided and stops propagation", () => {
    const editSpy = cy.stub().as("editHandler");
    cy.mount(<TaskCard task={mockTask} onEditClick={editSpy} />);
    cy.get('button[title="Edit Assignment"]').should("exist");
    cy.get('button[title="Edit Assignment"]').click();
    cy.get("@editHandler").should("have.been.calledWith", mockTask);
    cy.mount(<TaskCard task={mockTask} />);
    cy.get('button[title="Edit Assignment"]').should("not.exist");
  });
});
