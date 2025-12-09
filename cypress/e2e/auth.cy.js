describe("Authentication & Registration Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Login: successfully logs in as a Teacher", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          name: "Teacher Test",
          role: "teacher",
          email: "teach@test.com",
        },
        token: "fake-jwt-token",
      },
    }).as("loginRequest");
    cy.get('input[placeholder="Email"]').type("teach@test.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get("button").contains("Log in").click();
    cy.wait("@loginRequest");
    cy.url().should("include", "/teacher");
  });

  it("Login: displays error message with invalid credentials", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { error: "Invalid email or password" },
    }).as("loginFail");
    cy.get('input[placeholder="Email"]').type("wrong@test.com");
    cy.get('input[placeholder="Password"]').type("wrongpass");
    cy.get("button").contains("Log in").click();
    cy.wait("@loginFail");
    cy.get('p[class*="errorText"]')
      .should("be.visible")
      .and((element) => {
        const text = element.text();
        expect(text).to.match(
          /Invalid email or password|Login failed|Something went wrong/,
        );
      });
  });

  it("Navigation: switches between Login and Sign Up forms", () => {
    cy.contains("Don’t have an account?").should("be.visible");
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').should("be.visible");
    cy.contains("span", "Log in").click();
    cy.get('input[placeholder="Name"]').should("not.exist");
  });

  it("SignUp: validates password length (min 8 chars)", () => {
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').type("Test User");
    cy.get('input[placeholder="Email"]').type("new@test.com");
    cy.get('input[placeholder="Password"]').type("123");
    cy.contains("button", "student").click();
    cy.contains("button", "Male").click();
    cy.get("button").contains("Sign up").click();
    cy.contains("*Password must contain at least 8 characters").should(
      "be.visible",
    );
  });

  it("SignUp: successfully registers a new Student", () => {
    cy.contains("span", "Sign up").click();
    cy.intercept("POST", "**/auth/register", {
      statusCode: 201,
      body: {
        user: {
          id: 2,
          name: "New Student",
          role: "student",
          email: "new@stud.com",
        },
        token: "fake-jwt-token-2",
      },
    }).as("registerRequest");
    cy.get('input[placeholder="Name"]').type("New Student");
    cy.get('input[placeholder="Email"]').type("new@stud.com");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.contains("button", "Female").click();
    cy.contains("button", "student").click();
    cy.get("button").contains("Sign up").click();
    cy.wait("@registerRequest");
    cy.url().should("include", "/student");
  });
});
