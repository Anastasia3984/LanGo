describe("General App Flows", () => {
  it("Shows 404 Not Found page for unknown URLs", () => {
    cy.visit("/some-random-url-that-does-not-exist");
    cy.contains(/404|Not Found|Page not found/i).should("be.visible");
  });
});
