describe("Teacher Page", () => {
  const teacher = {
    id: 1,
    name: "Test Teacher",
    email: "teacher@test.com",
    role: "teacher",
  };

  const students = [
    { id: 101, name: "Student 1", email: "s1@test.com" },
    { id: 102, name: "Student 2", email: "s2@test.com" },
    { id: 103, name: "Student 3", email: "s3@test.com" },
    { id: 104, name: "Student 4", email: "s4@test.com" },
    { id: 105, name: "Student 5", email: "s5@test.com" },
    { id: 106, name: "Student 6", email: "s6@test.com" },
    { id: 107, name: "Student 7", email: "s7@test.com" },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/auth/me", { statusCode: 200, body: teacher }).as(
      "me",
    );
    cy.intercept("GET", "**/users*", { statusCode: 200, body: students }).as(
      "list",
    );

    cy.intercept("GET", "**/tasks*", { statusCode: 200, body: [] }).as("tasks");

    cy.intercept("POST", "**/invitations", {
      statusCode: 201,
      body: { success: true, link: "http://test-link.com" },
    }).as("invite");

    cy.intercept("POST", "**/assignments", {
      statusCode: 201,
      body: { success: true },
    }).as("assign");
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(teacher));
      win.localStorage.setItem("token", "fake-token");
    });

    cy.visit("/teacher");
    cy.wait("@list");
  });

  it("Shows teacher info", () => {
    cy.contains("h1", teacher.name).should("be.visible");
    cy.contains("a", teacher.email).should("be.visible");
  });

  it("Pagination: Shows 5 students then next page", () => {
    cy.contains("td", "Student 1").should("be.visible");
    cy.contains("td", "Student 5").should("be.visible");
    cy.contains("td", "Student 6").should("not.exist");
    cy.get("button:not([disabled])").contains("→").click();
    cy.contains("td", "Student 6").should("be.visible");
    cy.contains("td", "Student 1").should("not.exist");
  });

  it("Invite: Generates link", () => {
    cy.contains("button", "Invite student").click();
    cy.get('input[placeholder="Email"]').type("new@test.com");
    cy.contains("button", /^Invite$/).click();

    cy.wait("@invite");
    cy.contains("Link generated:").should("be.visible");
  });

  it("Homework: Opens modal", () => {
    cy.contains("td", "Add homework").first().click();
    cy.contains("h2", "Homework").should("be.visible");
  });

  it("Profile: Opens and deletes", () => {
    cy.contains("td", "Student 1").click();
    cy.get('[class*="profileModal"]').contains("Student 1");
    cy.contains("button", "Delete student").click();
  });
  it("Validation: Shows errors when submitting empty forms", () => {
    cy.contains("button", "Invite student").click();
    cy.contains("button", /^Invite$/).click();
    cy.contains("Email is required").should("be.visible");
    cy.reload();
    cy.contains("td", "Add homework").first().click();
    cy.get("form input, form select, form textarea").each(($el) => {
      cy.wrap($el).invoke("removeAttr", "required");
    });

    cy.contains("button", "Assign").click();
    cy.contains("*add title").should("be.visible");
    cy.contains("*add description").should("be.visible");
    cy.contains("*select a student").should("be.visible");
    cy.contains("*select due date").should("be.visible");
  });
  it("Student Profile: Cancel and Confirm Deletion flows", () => {
    cy.intercept("DELETE", "**/users/*", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteStudent");

    cy.contains("td", "Student 1").click();
    cy.contains("button", "Delete student").click();
    cy.contains("button", /Cancel|No/i).click();
    cy.get('[class*="profileModal"]')
      .contains("Student 1")
      .should("be.visible");
    cy.contains("button", "Delete student").click();
    cy.contains("button", /Yes|Delete|Confirm/i).click();
    cy.wait("@deleteStudent");
    cy.contains("has been deleted").should("be.visible");
  });
  it("Student Profile: Displays list of unchecked tasks", () => {
    const mockTasks = [
      {
        id: 901,
        status: "unreviewed",
        assignment: { title: "Essay about Summer" },
      },
      {
        id: 902,
        status: "solved",
        grade: null,
        assignment: { title: "Math Test 1" },
      },
    ];
    cy.intercept("GET", "**/submissions*", {
      statusCode: 200,
      body: mockTasks,
    }).as("getTasksWithData");

    cy.contains("td", "Student 1").click();
    cy.wait("@getTasksWithData");

    cy.contains("Essay about Summer").should("be.visible");
    cy.contains("Math Test 1").should("be.visible");
  });
  it("Validation: Shows errors when submitting empty forms", () => {
    cy.contains("button", "Invite student").click();
    cy.contains("button", /^Invite$/).click();
    cy.contains("Email is required").should("be.visible");
    cy.reload();
    cy.contains("td", "Add homework").first().click();
    cy.get("form input, form select, form textarea").each(($el) => {
      cy.wrap($el).invoke("removeAttr", "required");
    });

    cy.contains("button", "Assign").click();
    cy.contains("*add title").should("be.visible");
    cy.contains("*add description").should("be.visible");
    cy.contains("*select a student").should("be.visible");
    cy.contains("*select due date").should("be.visible");
  });
  it("Shows error message when API fails", () => {
    cy.intercept("GET", "**/users*", { statusCode: 500 }).as("getFail");

    cy.reload();
    cy.wait("@getFail");
    cy.contains(/Error|Failed/i).should("be.visible");
  });
});
