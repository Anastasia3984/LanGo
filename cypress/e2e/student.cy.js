describe("Student Page Functionality", () => {
  const student = {
    id: 101,
    name: "Jesse Student",
    email: "jesse@cook.com",
    role: "student",
    teacherId: 99,
  };

  const mockTasks = [
    {
      id: 1,
      status: "unsolved",
      assignment: {
        title: "Algebra 101",
        description: "Solve [Link](http://google.com)",
      },
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: 2,
      status: "unsolved",
      assignment: { title: "Physics Lab", description: "Desc" },
      dueDate: new Date().toISOString(),
    },
    {
      id: 3,
      status: "unsolved",
      assignment: { title: "History Essay", description: "Desc" },
      dueDate: new Date().toISOString(),
    },
    {
      id: 4,
      status: "unsolved",
      assignment: { title: "Chemistry", description: "Desc" },
      dueDate: new Date().toISOString(),
    },
    {
      id: 5,
      status: "unsolved",
      assignment: { title: "Biology (Page 2)", description: "Desc" },
      dueDate: new Date().toISOString(),
    },
    {
      id: 6,
      status: "reviewed",
      assignment: { title: "English Test", description: "Done" },
      dueDate: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/auth/me", { statusCode: 200, body: student }).as(
      "getMe",
    );
    cy.intercept("GET", "**/submissions*", {
      statusCode: 200,
      body: mockTasks,
    }).as("getTasks");
    cy.intercept("POST", "**/messages", {
      statusCode: 201,
      body: { success: true },
    }).as("sendMessage");
    cy.intercept("PATCH", "**/submissions/*", {
      statusCode: 200,
      body: { success: true },
    }).as("updateTask");
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(student));
      win.localStorage.setItem("token", "fake-jwt-token");
    });

    cy.visit("/student");
    cy.wait("@getTasks");
  });

  it("Renders profile and separates tasks correctly", () => {
    cy.contains("h1", student.name).should("be.visible");
    cy.contains("Algebra 101").should("be.visible");
    cy.contains("Chemistry").should("be.visible");
    cy.contains("Biology (Page 2)").should("not.exist");
    cy.contains("English Test").should("be.visible");
  });

  it("Pagination: Navigates to next page of Unsolved tasks", () => {
    cy.get("button:not([disabled])").contains("→").click();
    cy.contains("Biology (Page 2)").should("be.visible");
    cy.contains("Algebra 101").should("not.exist");
  });

  it("Contact Teacher: Validation and Success Flow", () => {
    cy.contains("button", "Contact teacher").click();
    cy.contains("h2", "Send message").should("be.visible");
    cy.contains("button", /^Send$/).click();
    cy.contains("h2", "Send message").should("be.visible");

    cy.get('input[placeholder="Subject"]').type("Help with Homework");
    cy.get('textarea[placeholder="Message"]').type(
      "I do not understand Algebra.",
    );
    cy.contains("button", /^Send$/).click();
    cy.wait("@sendMessage")
      .its("request.body")
      .should((body) => {
        expect(body.receiverId).to.equal(student.teacherId);
        expect(body.subject).to.equal("Help with Homework");
      });
    cy.contains("Message has been sent to teacher!").should("be.visible");
  });

  it("Homework Submission: Mark as Solved", () => {
    cy.contains("Algebra 101").click();

    cy.contains("h3", "Algebra 101").should("be.visible");

    cy.contains("a", "Link").should("have.attr", "href", "http://google.com");

    cy.contains("button", "Mark as solved").click();
    cy.contains("Please provide a solution").should("be.visible");
    cy.get('textarea[placeholder="Write your solution here..."]').type(
      "x = 42",
    );

    cy.contains("button", "Mark as solved").click();
    cy.wait("@updateTask")
      .its("request.body")
      .should((body) => {
        expect(body.solution).to.equal("x = 42");
        expect(body.status).to.equal("unreviewed");
      });

    cy.contains("Homework marked as solved!").should("be.visible");
  });

  it("Homework Submission: Save Progress", () => {
    cy.contains("Physics Lab").click();
    cy.get('textarea[placeholder="Write your solution here..."]').type(
      "Drafting...",
    );
    cy.contains("button", "Save progress").click();
    cy.wait("@updateTask")
      .its("request.body")
      .should((body) => {
        expect(body.solution).to.equal("Drafting...");
        expect(body.status).to.be.undefined;
      });
    cy.contains("Progress has been saved!").should("be.visible");
  });
  it("Shows error message when API fails", () => {
    cy.intercept("GET", "**/submissions*", { statusCode: 500 }).as("getFail");
    cy.reload();
    cy.wait("@getFail");
    cy.contains("Error:").should("be.visible");
  });
  it('Shows "No tasks" when list is empty', () => {
    cy.intercept("GET", "**/submissions*", { body: [] }).as("getEmpty");
    cy.reload();
    cy.contains("No solved tasks yet").should("be.visible");
  });
});
