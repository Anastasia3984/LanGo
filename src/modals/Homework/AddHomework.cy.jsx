import React from "react";
import AddHomework from "./AddHomework";
import { AuthContext } from "../../context/AuthContext";

const mockUser = { id: "teacher_123", name: "Mr. Teacher" };

const mockStudents = [
  { id: "student_1", name: "Alex Johnson", email: "alex@test.com" },
  { id: "student_2", name: "Maria Garcia", email: "maria@test.com" },
];

const MockAuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: mockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

describe("AddHomework Component", () => {
  it("1. Renders all form fields and student options", () => {
    cy.mount(
      <MockAuthProvider>
        <AddHomework allStudents={mockStudents} />
      </MockAuthProvider>,
    );

    cy.contains("h2", "Homework").should("be.visible");
    cy.get('input[placeholder="Title"]').should("be.visible");
    cy.get('textarea[placeholder="Description"]').should("be.visible");
    cy.get('input[type="date"]').should("be.visible");
    cy.get('input[type="time"]').should("be.visible");
    cy.get("select").should("contain", "Alex Johnson");
    cy.get('button[type="submit"]').should("contain", "Assign");
  });

  it("2. Shows error messages when submitting empty form", () => {
    cy.mount(
      <MockAuthProvider>
        <AddHomework allStudents={mockStudents} />
      </MockAuthProvider>,
    );
    cy.get("form").invoke("attr", "novalidate", true);
    cy.get('button[type="submit"]').click();
    cy.contains("*add title").should("be.visible");
    cy.contains("*add description").should("be.visible");
    cy.contains("*select a student").should("be.visible");
    cy.contains("*select due date").should("be.visible");
    cy.contains("*select due time").should("be.visible");
  });

  it("3. Shows error if due date is in the past", () => {
    cy.mount(
      <MockAuthProvider>
        <AddHomework allStudents={mockStudents} />
      </MockAuthProvider>,
    );
    cy.get("form").invoke("attr", "novalidate", true);

    cy.get('input[placeholder="Title"]').type("Test HW");
    cy.get('textarea[placeholder="Description"]').type("Read page 10");
    cy.get("select").select("student_1");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    cy.get('input[type="date"]').type(dateStr);
    cy.get('input[type="time"]').type("12:00");

    cy.get('button[type="submit"]').click();

    cy.contains("date has to be in future").should("be.visible");
  });

  it("4. Submits form correctly, calls notification and closes modal", () => {
    const setNotificationSpy = cy.stub().as("setNotification");
    const closeModalSpy = cy.stub().as("closeModal");

    cy.intercept("POST", "**/assignments", {
      statusCode: 201,
      body: { success: true, id: "new_assignment_id" },
    }).as("createAssignmentRequest");

    cy.mount(
      <MockAuthProvider>
        <AddHomework
          allStudents={mockStudents}
          setNotification={setNotificationSpy}
          closeModal={closeModalSpy}
        />
      </MockAuthProvider>,
    );

    cy.get('input[placeholder="Title"]').type("Essay on React");
    cy.get('textarea[placeholder="Description"]').type("Write 500 words.");
    cy.get("select").select("student_2");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    cy.get('input[type="date"]').type(dateStr);
    cy.get('input[type="time"]').type("14:00");

    cy.get('button[type="submit"]').click();

    cy.get('button[type="submit"]').should("contain", "Assigning...");

    cy.wait("@createAssignmentRequest").then((interception) => {
      const body = interception.request.body;
      expect(body).to.include({
        title: "Essay on React",
        description: "Write 500 words.",
        teacherId: mockUser.id,
        studentId: "student_2",
      });
      expect(body.dueDate).to.include(dateStr);
    });

    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Homework assigned successfully!",
    );
    cy.get("@closeModal").should("have.been.called");
  });

  it("5. Handles API errors gracefully", () => {
    cy.intercept("POST", "**/assignments", {
      statusCode: 500,
      body: { error: "Server Error" },
    }).as("failedRequest");

    cy.mount(
      <MockAuthProvider>
        <AddHomework allStudents={mockStudents} />
      </MockAuthProvider>,
    );
    cy.get("form").invoke("attr", "novalidate", true);

    cy.get('input[placeholder="Title"]').type("Fail Test");
    cy.get('textarea[placeholder="Description"]').type("Desc");
    cy.get("select").select("student_1");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('input[type="date"]').type(tomorrow.toISOString().split("T")[0]);
    cy.get('input[type="time"]').type("10:00");

    cy.get('button[type="submit"]').click();

    cy.wait("@failedRequest");

    cy.contains("Failed to add homework. Please try again.").should(
      "be.visible",
    );
  });
});
