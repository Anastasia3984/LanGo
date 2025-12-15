import React from "react";
import StudentTable from "./StudentTable";

const mockStudents = [
  {
    _id: "1",
    id: 101,
    name: "Olena Petrenko",
    email: "olena@example.com",
    lastActivity: "2023-11-05T14:30:00",
    uncheckedCount: 99,
  },
  {
    _id: "2",
    id: 102,
    name: "Ivan Sydorov",
    email: "ivan@example.com",
    lastActivity: null,
    uncheckedCount: 0,
  },
];

describe("StudentTable Component", () => {
  it("1. Renders table with correct student data", () => {
    cy.mount(<StudentTable students={mockStudents} />);
    cy.contains("list of students").should("be.visible");
    cy.contains("Olena Petrenko").should("be.visible");
    cy.contains("td", "99").should("be.visible");
  });

  it("2. Formats dates correctly (uk-UA) and handles missing dates", () => {
    cy.mount(<StudentTable students={mockStudents} />);
    cy.contains("05.11.2023").should("be.visible");
    cy.contains("tr", "Ivan Sydorov").within(() => {
      cy.contains("td", "-").should("be.visible");
    });
  });

  it("3. Applies bold styling only when uncheckedCount > 0", () => {
    cy.mount(<StudentTable students={mockStudents} />);
    cy.contains("td", "99")
      .should("have.css", "font-weight")
      .and("match", /bold|700/);
    cy.contains("td", "0")
      .should("have.css", "font-weight")
      .and("match", /normal|400/);
  });

  it("4. Calls correct handlers with student ID when cells are clicked", () => {
    const onNameClickSpy = cy.stub().as("nameClick");
    const onSolvedClickSpy = cy.stub().as("solvedClick");
    const onAddHomeworkSpy = cy.stub().as("addHomeworkClick");

    cy.mount(
      <StudentTable
        students={mockStudents}
        onNameClick={onNameClickSpy}
        onSolvedClick={onSolvedClickSpy}
        onAddHomeworkClick={onAddHomeworkSpy}
      />,
    );

    cy.contains("Olena Petrenko").click({ force: true });
    cy.get("@nameClick").should("have.been.calledWith", 101);

    cy.contains("td", "99").click({ force: true });
    cy.get("@solvedClick").should("have.been.calledWith", 101);

    cy.contains("tr", "Olena Petrenko")
      .find("td")
      .contains("Add homework")
      .click({ force: true });

    cy.get("@addHomeworkClick").should("have.been.calledWith", 101);
  });

  it("5. Renders without crashing when student list is empty", () => {
    cy.mount(<StudentTable students={[]} />);
    cy.contains("list of students").should("be.visible");
    cy.get("tbody tr").should("not.exist");
  });
});
