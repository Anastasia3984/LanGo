import React from "react";
import LogIn from "./LogIn";
import { AuthContext } from "../../context/AuthContext";

const MockAuthProvider = ({ children, loginStub }) => {
  return (
    <AuthContext.Provider value={{ login: loginStub }}>
      {children}
    </AuthContext.Provider>
  );
};

describe("LogIn Component", () => {
  it("1. Renders login form elements correctly", () => {
    const loginStub = cy.stub();

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn />
      </MockAuthProvider>,
    );

    cy.contains("h2", "Log in").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Log in").should("be.visible");
    cy.contains("Don’t have an account?").should("be.visible");
  });
  it("2. Shows error if fields are empty on submit", () => {
    const loginStub = cy.stub();

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn />
      </MockAuthProvider>,
    );
    cy.get('button[type="submit"]').click();
    cy.contains("*Please fill in all fields").should("be.visible");
    expect(loginStub).to.not.be.called;
  });

  it("3. Calls login() and redirects on success", () => {
    const loginStub = cy
      .stub()
      .resolves({
        success: true,
        user: { role: "teacher" },
      })
      .as("loginApi");

    const onAuthSuccessSpy = cy.stub().as("successHandler");

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn onAuthSuccess={onAuthSuccessSpy} />
      </MockAuthProvider>,
    );
    cy.get('input[type="email"]').type("teacher@lango.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.get("@loginApi").should(
      "have.been.calledWith",
      "teacher@lango.com",
      "password123",
    );
    cy.get("@successHandler").should("have.been.calledWith", "teacher");
  });
  it("4. Displays error message when login fails", () => {
    const errorMessage = "Invalid email or password";
    const loginStub = cy
      .stub()
      .resolves({
        success: false,
        error: errorMessage,
      })
      .as("loginApi");

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn />
      </MockAuthProvider>,
    );

    cy.get('input[type="email"]').type("wrong@email.com");
    cy.get('input[type="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.get("@loginApi").should("have.been.called");
    cy.contains(errorMessage).should("be.visible");
  });
  it("5. Handles unexpected errors gracefully", () => {
    const loginStub = cy.stub().rejects(new Error("Network Error"));

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn />
      </MockAuthProvider>,
    );

    cy.get('input[type="email"]').type("test@test.com");
    cy.get('input[type="password"]').type("123");
    cy.get('button[type="submit"]').click();
    cy.contains("An unexpected error occurred. Please try again.").should(
      "be.visible",
    );
  });
  it('6. Calls onSwitchToSignUp when "Sign up" is clicked', () => {
    const loginStub = cy.stub();
    const switchSpy = cy.stub().as("switchHandler");

    cy.mount(
      <MockAuthProvider loginStub={loginStub}>
        <LogIn onSwitchToSignUp={switchSpy} />
      </MockAuthProvider>,
    );

    cy.contains("Sign up").click();

    cy.get("@switchHandler").should("have.been.called");
  });
});
