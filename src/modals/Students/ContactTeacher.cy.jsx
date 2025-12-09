import React from "react";
import ContactTeacher from "./ContactTeacher";
import { AuthContext } from "../../context/AuthContext";
const mockStudent = {
  id: "student_101",
  name: "John Student",
  email: "john@lango.com",
  teacherId: "teacher_555",
};
const MockAuthProvider = ({ user = mockStudent, children }) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

describe("ContactTeacher Component", () => {
  it("1. Renders form with pre-filled disabled user data", () => {
    cy.mount(
      <MockAuthProvider>
        <ContactTeacher />
      </MockAuthProvider>,
    );

    cy.contains("h2", "Send message").should("be.visible");
    cy.get('input[placeholder="Your nickname"]')
      .should("be.disabled")
      .and("have.value", mockStudent.name);

    cy.get('input[placeholder="Your email"]')
      .should("be.disabled")
      .and("have.value", mockStudent.email);
    cy.get('input[placeholder="Subject"]').should("not.be.disabled");
    cy.get('textarea[placeholder="Message"]').should("not.be.disabled");
  });
  it("2. Sends message API request with correct data", () => {
    const closeModalSpy = cy.stub().as("closeModal");
    const setNotificationSpy = cy.stub().as("setNotification");
    cy.intercept("POST", "**/messages", {
      statusCode: 201,
      body: { success: true },
    }).as("sendMessage");

    cy.mount(
      <MockAuthProvider>
        <ContactTeacher
          closeModal={closeModalSpy}
          setNotification={setNotificationSpy}
        />
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Subject"]').type("Question about Homework");
    cy.get('textarea[placeholder="Message"]').type("Can you check task #3?");
    cy.get("button").contains("Send").click();
    cy.get("button").should("contain", "Sending...");
    cy.wait("@sendMessage").then((interception) => {
      const body = interception.request.body;
      expect(body.senderId).to.equal(mockStudent.id);
      expect(body.receiverId).to.equal(mockStudent.teacherId);
      expect(body.subject).to.equal("Question about Homework");
      expect(body.body).to.equal("Can you check task #3?");
    });

    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Message has been sent to teacher!",
    );
    cy.get("@closeModal").should("have.been.called");
  });

  it("3. Shows error if user has no teacher assigned", () => {
    const studentNoTeacher = {
      ...mockStudent,
      teacherId: null,
      teacher_id: null,
    };
    const setNotificationSpy = cy.stub().as("setNotification");

    cy.mount(
      <MockAuthProvider user={studentNoTeacher}>
        <ContactTeacher setNotification={setNotificationSpy} />
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Subject"]').type("Hello");
    cy.get('textarea[placeholder="Message"]').type("World");

    cy.get("button").contains("Send").click();
    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Error: Teacher not assigned to this account.",
    );
  });

  it("4. Handles API errors gracefully", () => {
    const setNotificationSpy = cy.stub().as("setNotification");
    cy.intercept("POST", "**/messages", {
      statusCode: 500,
      body: { error: "Server Error" },
    }).as("failedMessage");

    cy.mount(
      <MockAuthProvider>
        <ContactTeacher setNotification={setNotificationSpy} />
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Subject"]').type("Bug report");
    cy.get('textarea[placeholder="Message"]').type("Something went wrong");

    cy.get("button").contains("Send").click();

    cy.wait("@failedMessage");
    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Error: Failed to send message.",
    );
  });
  it("5. Does not submit empty form (browser validation)", () => {
    const sendMessageSpy = cy.spy().as("apiCall");
    cy.intercept("POST", "**/messages", sendMessageSpy);

    cy.mount(
      <MockAuthProvider>
        <ContactTeacher />
      </MockAuthProvider>,
    );
    cy.get("button").contains("Send").click();
    cy.get("@apiCall").should("not.have.been.called");
  });
});
