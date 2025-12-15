import React from "react";
import Header from "./Header";
import { MemoryRouter, useLocation, Routes, Route } from "react-router-dom";

const LocationSpy = () => {
  const location = useLocation();
  return <div data-cy="location-display">{location.pathname}</div>;
};

describe("Header Component", () => {
  it("1. Renders logo, avatar, and logout button", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    cy.contains("LanGo").should("be.visible");
    cy.get("button").contains("Log out").should("be.visible");
    cy.get('div[class*="avatarCircle"]').should("exist");
  });

  it("2. Displays notification message when provided", () => {
    const message = "Homework submitted successfully!";

    cy.mount(
      <MemoryRouter>
        <Header notificationMessage={message} />
      </MemoryRouter>,
    );
    cy.contains(message).should("be.visible");
  });

  it('3. Clears localStorage and redirects to "/" on Logout', () => {
    const removeItemSpy = cy
      .spy(window.localStorage, "removeItem")
      .as("lsRemove");
    cy.mount(
      <MemoryRouter initialEntries={["/teacher"]}>
        <LocationSpy />
        <Header />
      </MemoryRouter>,
    );
    cy.get("button").contains("Log out").click();
    cy.get("@lsRemove").should("be.calledWith", "authToken");
    cy.get("@lsRemove").should("be.calledWith", "userRole");
    cy.get('[data-cy="location-display"]').should("have.text", "/");
  });
  it('4. Does NOT show "Back" button on standard pages', () => {
    cy.mount(
      <MemoryRouter initialEntries={["/teacher"]}>
        <Header />
      </MemoryRouter>,
    );

    cy.contains("Back to my profile").should("not.exist");
  });
  it('5. Shows "Back" button on student detail page and navigates back', () => {
    const initialRoute = "/teacher/student/123";
    cy.mount(
      <MemoryRouter initialEntries={[initialRoute]}>
        <LocationSpy />
        <Routes>
          <Route path="/teacher/student/:studentId" element={<Header />} />
          <Route path="/teacher" element={<div>Teacher Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );
    cy.contains("Back to my profile").should("be.visible");
    cy.contains("Back to my profile").click();
    cy.get('[data-cy="location-display"]').should("have.text", "/teacher");
  });
});
