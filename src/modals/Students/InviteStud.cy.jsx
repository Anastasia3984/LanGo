import React from "react";
import InviteStud from "./InviteStud";
import { AuthContext } from "../../context/AuthContext";

const mockUser = {
  id: "teacher_777",
  name: "Mr. Anderson",
};

const MockAuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: mockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

describe("InviteStud Component", () => {
  it("1. Renders form with default message", () => {
    cy.mount(
      <MockAuthProvider>
        <InviteStud />
      </MockAuthProvider>,
    );

    cy.contains("h2", "Invite").should("be.visible");
    cy.get('input[type="email"]').should("have.value", "");
    cy.get("textarea").should(
      "have.value",
      "Hello! I'd like to invite you to join our learning platform.",
    );
    cy.get('button[type="submit"]').should("contain", "Invite");
  });
  it("2. Shows error if email is missing", () => {
    cy.mount(
      <MockAuthProvider>
        <InviteStud />
      </MockAuthProvider>,
    );
    cy.get('button[type="submit"]').click({ force: true });

    cy.contains("Email is required.").should("be.visible");
  });
  it("3. Sends invitation successfully and closes modal", () => {
    const closeModalSpy = cy.stub().as("closeModal");
    const setNotificationSpy = cy.stub().as("setNotification");
    cy.intercept("POST", "**/invitations", {
      statusCode: 200,
      body: { success: true },
    }).as("inviteRequest");

    cy.mount(
      <MockAuthProvider>
        <InviteStud
          closeModal={closeModalSpy}
          setNotification={setNotificationSpy}
        />
      </MockAuthProvider>,
    );

    cy.get('input[type="email"]').type("student@test.com");
    cy.get('button[type="submit"]').click({ force: true });
    cy.wait("@inviteRequest").then((interception) => {
      expect(interception.request.body).to.deep.include({
        email: "student@test.com",
        teacherId: mockUser.id,
      });
    });
    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Invitation sent successfully!",
    );
    cy.get("@closeModal").should("have.been.called");
  });
  it("4. Displays generated link if server returns one (modal stays open)", () => {
    const setNotificationSpy = cy.stub().as("setNotification");
    const testLink = "http://localhost:3000/register?token=abc-123";
    cy.intercept("POST", "**/invitations", {
      statusCode: 200,
      body: { success: true, link: testLink },
    }).as("linkRequest");

    cy.mount(
      <MockAuthProvider>
        <InviteStud setNotification={setNotificationSpy} />
      </MockAuthProvider>,
    );

    cy.get('input[type="email"]').type("manual@link.com");
    cy.get('button[type="submit"]').click({ force: true });

    cy.wait("@linkRequest");

    cy.contains("Link generated:").should("be.visible");
    cy.contains("Click to register")
      .should("have.attr", "href", testLink)
      .and("have.attr", "target", "_blank");

    cy.get("@setNotification").should(
      "have.been.calledWith",
      "Test link generated! See below.",
    );
  });
});
