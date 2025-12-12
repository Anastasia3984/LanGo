describe("REAL System: Full User Journey (Invite -> Assign -> Solve)", () => {
  const timestamp = Date.now();
  const teacherData = {
    name: `Teach ${timestamp}`,
    email: `t.${timestamp}@real.com`,
    password: "password123",
  };
  const studentData = {
    name: `Stud ${timestamp}`,
    email: `s.${timestamp}@real.com`,
    password: "password123",
  };

  it("Flow: Teacher Invites Student -> Student Registers -> Teacher Assigns HW -> Student Solves", () => {
    cy.visit("/");
    cy.contains("span", "Sign up").click();
    cy.get('input[placeholder="Name"]').type(teacherData.name);
    cy.get('input[placeholder="Email"]').type(teacherData.email);
    cy.get('input[placeholder="Password"]').type(teacherData.password);
    cy.contains("button", "teacher").click();
    cy.contains("button", "Male").click();
    cy.get("button").contains("Sign up").click();
    cy.url().should("include", "/teacher");
    cy.contains("button", "Invite student").click();
    cy.get('input[placeholder="Email"]').type(studentData.email);
    cy.contains("button", /^Invite$/).click();
    cy.contains("a", "Click to register")
      .should("have.attr", "href")
      .then((href) => {
        cy.clearLocalStorage();
        cy.visit(href);
        cy.get('input[placeholder="Name"]').type(studentData.name);
        cy.get('input[placeholder="Password"]').type(studentData.password);
        cy.contains("button", "Female").click();

        cy.get("button").contains("Sign up").click();
        cy.url().should("include", "/student");
        cy.contains(studentData.name).should("be.visible");
        cy.clearLocalStorage();
      });
    cy.visit("/");
    cy.get('input[placeholder="Email"]').type(teacherData.email);
    cy.get('input[placeholder="Password"]').type(teacherData.password);
    cy.get("button").contains("Log in").click();

    cy.contains("button", "Add homework").click();
    cy.get("input, select, textarea").each(($el) => $el.removeAttr("required"));

    cy.get('input[placeholder="Title"]').type(`Real HW ${timestamp}`);
    cy.get('textarea[placeholder="Description"]').type("Real DB Test");
    cy.get("select").should("contain", studentData.name);
    cy.get("select")
      .contains(studentData.name)
      .then(($option) => {
        cy.get("select").select($option.val());
      });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    cy.get('input[type="date"]').type(dateStr);
    cy.get('input[type="time"]').type("12:00");
    cy.contains("button", "Assign").click();
    cy.contains("Homework assigned successfully").should("be.visible");

    cy.clearLocalStorage();
    cy.visit("/");
    cy.get('input[placeholder="Email"]').type(studentData.email);
    cy.get('input[placeholder="Password"]').type(studentData.password);
    cy.get("button").contains("Log in").click();
    cy.contains(`Real HW ${timestamp}`).should("be.visible");
    cy.contains(`Real HW ${timestamp}`).click();
    cy.get('textarea[placeholder="Write your solution here..."]').type("Done!");
    cy.contains("button", "Mark as solved").click();
    cy.contains("Homework marked as solved!").should("be.visible");
  });
});
