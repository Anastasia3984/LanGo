import React from "react";
import EditHW from "./EditHW";

const mockHomework = {
  id: 55,
  title: "Original Title",
  description: "Original Description",
  dueDate: "2023-12-25T14:30:00.000Z",
};

describe("EditHW Component", () => {
  it("1. Renders with initial data (Title, Description, Date, Time)", () => {
    cy.mount(<EditHW homework={mockHomework} />);

    cy.contains("h2", "Homework").should("be.visible");
    cy.get('input[placeholder="Title"]').should(
      "have.value",
      mockHomework.title,
    );
    cy.get('textarea[placeholder="Description"]').should(
      "have.value",
      mockHomework.description,
    );
    cy.get('input[type="date"]').should("not.have.value", "");
    cy.get('input[type="time"]').should("not.have.value", "");
  });
  it("2. Updates fields and calls onSave with new data", () => {
    const onSaveSpy = cy.stub().as("saveHandler");
    const setNotificationSpy = cy.stub().as("notifySpy");
    const closeModalSpy = cy.stub().as("closeSpy");

    cy.mount(
      <EditHW
        homework={mockHomework}
        onSave={onSaveSpy}
        setNotification={setNotificationSpy}
        closeModal={closeModalSpy}
      />,
    );
    const newTitle = "Updated Homework Title";
    cy.get('input[placeholder="Title"]').clear().type(newTitle);
    const newDesc = "New details";
    cy.get('textarea[placeholder="Description"]').clear().type(newDesc);
    cy.get('input[type="date"]').type("2024-01-01");
    cy.get('input[type="time"]').type("10:00");
    cy.get("button").contains("Save").click();
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Homework has been saved!",
    );
    cy.get("@closeSpy").should("have.been.called");

    cy.get("@saveHandler").should((spy) => {
      const updatedObj = spy.args[0][0];

      expect(updatedObj.id).to.equal(mockHomework.id);
      expect(updatedObj.title).to.equal(newTitle);
      expect(updatedObj.description).to.equal(newDesc);
      expect(updatedObj.dueDate).to.include("2024-01-01");
    });
  });

  it("3. Calls onDelete with correct ID when Delete button is clicked", () => {
    const onDeleteSpy = cy.stub().as("deleteHandler");
    const setNotificationSpy = cy.stub().as("notifySpy");
    const closeModalSpy = cy.stub().as("closeSpy");

    cy.mount(
      <EditHW
        homework={mockHomework}
        onDelete={onDeleteSpy}
        setNotification={setNotificationSpy}
        closeModal={closeModalSpy}
      />,
    );
    cy.get("button").contains("Delete").click();
    cy.get("@deleteHandler").should("have.been.calledWith", mockHomework.id);
    cy.get("@notifySpy").should(
      "have.been.calledWith",
      "Homework has been deleted!",
    );
    cy.get("@closeSpy").should("have.been.called");
  });
  it("4. Handles invalid date gracefully (inputs remain empty)", () => {
    const brokenHomework = { ...mockHomework, dueDate: "invalid-date-string" };
    cy.mount(<EditHW homework={brokenHomework} />);
    cy.get('input[type="date"]').should("have.value", "");
    cy.get('input[type="time"]').should("have.value", "");
  });
});
