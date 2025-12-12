import React from "react";
import SignUp from "./SignUp";
import { AuthContext } from "../../context/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
const MockAuthProvider = ({ children, signupStub }) => {
  return (
    <AuthContext.Provider value={{ signup: signupStub }}>
      {children}
    </AuthContext.Provider>
  );
};

describe("SignUp Component", () => {
  it("1. Renders all inputs and allows typing", () => {
    const signupStub = cy.stub();

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </MockAuthProvider>,
    );

    cy.contains("h2", "Sign up").should("be.visible");
    cy.get('input[placeholder="Name"]')
      .type("John Doe")
      .should("have.value", "John Doe");
    cy.get('input[placeholder="Email"]')
      .type("john@test.com")
      .should("have.value", "john@test.com");
    cy.get('input[placeholder="Password"]')
      .type("secret123")
      .should("have.value", "secret123");
    cy.contains("button", "Male").should("be.visible");
    cy.contains("button", "Female").should("be.visible");
    cy.contains("button", "student").should("be.visible");
    cy.contains("button", "teacher").should("be.visible");
  });

  it("2. Shows error if required fields are missing", () => {
    const signupStub = cy.stub();

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </MockAuthProvider>,
    );

    cy.get('button[type="submit"]').click();

    cy.contains("*Please fill in all required fields").should("be.visible");
    expect(signupStub).to.not.be.called;
  });
  it("3. Shows error if password is too short (< 8 chars)", () => {
    const signupStub = cy.stub();

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Name"]').type("Jane");
    cy.get('input[placeholder="Email"]').type("jane@test.com");
    cy.get('input[placeholder="Password"]').type("short");
    cy.contains("button", "student").click();

    cy.get('button[type="submit"]').click();

    cy.contains("*Password must contain at least 8 characters").should(
      "be.visible",
    );
    expect(signupStub).to.not.be.called;
  });
  it("4. Calls signup() with correct data on success", () => {
    const signupStub = cy
      .stub()
      .resolves({
        success: true,
        user: { role: "teacher" },
      })
      .as("signupApi");

    const successSpy = cy.stub().as("successHandler");

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp onAuthSuccess={successSpy} />
        </MemoryRouter>
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Name"]').type("Teacher Max");
    cy.get('input[placeholder="Email"]').type("max@lango.com");
    cy.get('input[placeholder="Password"]').type("securePass123");
    cy.contains("button", "Male").click();
    cy.contains("button", "teacher").click();
    cy.get('button[type="submit"]').click();
    cy.get("@signupApi").should("have.been.calledWithMatch", {
      name: "Teacher Max",
      email: "max@lango.com",
      password: "securePass123",
      role: "teacher",
      gender: "male",
      token: null,
    });
    cy.get("@successHandler").should("have.been.calledWith", "teacher");
  });
  it("5. Handles invitation token correctly (locks role to student)", () => {
    const signupStub = cy
      .stub()
      .resolves({ success: true, user: { role: "student" } })
      .as("signupApi");
    const inviteToken = "abc-123-token";
    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter initialEntries={[`/signup?token=${inviteToken}`]}>
          <SignUp />
        </MemoryRouter>
      </MockAuthProvider>,
    );
    cy.contains("You are accepting an invitation!").should("be.visible");
    cy.contains("button", "student").should("not.exist");
    cy.contains("button", "teacher").should("not.exist");
    cy.get('input[placeholder="Name"]').type("Invited Student");
    cy.get('input[placeholder="Email"]').type("new@student.com");
    cy.get('input[placeholder="Password"]').type("password123");

    cy.get('button[type="submit"]').click();
    cy.get("@signupApi").should("have.been.calledWithMatch", {
      role: "student",
      token: inviteToken,
    });
  });

  it("6. Displays error message from server", () => {
    const errorMsg = "Email already exists";
    const signupStub = cy.stub().resolves({ success: false, error: errorMsg });

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </MockAuthProvider>,
    );
    cy.get('input[placeholder="Name"]').type("User");
    cy.get('input[placeholder="Email"]').type("exist@email.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.contains("button", "student").click();

    cy.get('button[type="submit"]').click();

    cy.contains(errorMsg).should("be.visible");
  });
  it("7. Calls onSwitchToLogIn when link is clicked", () => {
    const signupStub = cy.stub();
    const switchSpy = cy.stub().as("switchHandler");

    cy.mount(
      <MockAuthProvider signupStub={signupStub}>
        <MemoryRouter>
          <SignUp onSwitchToLogIn={switchSpy} />
        </MemoryRouter>
      </MockAuthProvider>,
    );

    cy.contains("Log in").click();
    cy.get("@switchHandler").should("have.been.called");
  });
});
