describe("REAL System: Auth Flow (Frontend + Backend + DB)", () => {
  const timestamp = Date.now();
  const teacherEmail = `real.teach.${timestamp}@test.com`;
  const studentEmail = `real.stud.${timestamp}@test.com`;
  const password = "password123";
  beforeEach(() => {
    cy.visit("/");
  });
  it("1. Registers a new Teacher (Happy Path)", () => {
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').type(`Real Teacher ${timestamp}`);
    cy.get('input[placeholder="Email"]').type(teacherEmail);
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains("button", "teacher").click();
    cy.contains("button", "Male").click();
    cy.get("button").contains("Sign up").click();
    cy.url().should("include", "/teacher");
    cy.contains(`Real Teacher ${timestamp}`).should("be.visible");
    cy.window().its("localStorage.token").should("exist");
  });

  it("2. Registers a new Student (Happy Path)", () => {
    cy.clearLocalStorage(); 
    cy.reload();
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').type(`Real Student ${timestamp}`);
    cy.get('input[placeholder="Email"]').type(studentEmail);
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains("button", "student").click();
    cy.contains("button", "Female").click();
    cy.get("button").contains("Sign up").click();
    cy.url().should("include", "/student");
  });
  it("3. Validation: Prevents submission with empty fields", () => {
    cy.get("button").contains("Log in").click();
    cy.contains(/Please fill in all fields|required/i).should("be.visible");
    cy.contains("span", "Sign up").click();
    cy.get("button").contains("Sign up").click();
    cy.contains(/Please fill in all required fields|required/i).should("be.visible");
  });

  it("4. Validation: Prevents registration with short password", () => {
    cy.contains("span", "Sign up").click();
    
    cy.get('input[placeholder="Name"]').type("Bad User");
    cy.get('input[placeholder="Email"]').type(`bad.${timestamp}@test.com`);
    cy.get('input[placeholder="Password"]').type("123");
    cy.contains("button", "student").click();
    cy.contains("button", "Male").click();
    cy.get("button").contains("Sign up").click();
    cy.url().should("not.include", "/student");
    cy.contains(/Password must contain at least 8 characters/i).should("be.visible");
  });

  it("5. Security: Redirects unauthenticated user from protected route", () => {
    cy.clearLocalStorage();
    cy.visit("/teacher");
    cy.url().should("not.include", "/teacher");
    cy.url().should("not.include", "/student");
  });
  it("6. Backend Error: Prevents duplicate email registration", () => {
    cy.clearLocalStorage();
    cy.reload();
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').type("Duplicate Teacher");
    cy.get('input[placeholder="Email"]').type(teacherEmail); 
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains("button", "teacher").click();
    cy.contains("button", "Male").click();
    cy.get("button").contains("Sign up").click();
    cy.contains(/User already exists|Something went wrong/i).should("be.visible");
  });
});