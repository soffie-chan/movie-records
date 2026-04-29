import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

describe("App Component", () => {
    test("renders the course name somewhere", () => {
        render(<App />);
        const linkElement = screen.getByText(/Movie Records/i);
        expect(linkElement).toBeInTheDocument();
        //Default
    });

    test("AddMovieModal Save Changes adds another movie", () => {
        render(<App />);
        const movieHeadingsBefore = screen.getAllByRole("heading", {
            level: 3,
        });
        //Pick third heading
        const addNewButton = screen.getByText("Add New Movie");
        userEvent.click(addNewButton);
        //Create and click Add New Movie
        const saveChanges = screen.getByRole("button", {
            name: /Save Changes/i,
        });
        //Save New Movie
        userEvent.click(saveChanges);
        const movieHeadingsAfter = screen.getAllByRole("heading", { level: 3 });
        //Now should be +1 since it moved down a level
        expect(movieHeadingsAfter.length).toBe(movieHeadingsBefore.length + 1);
    });

    test("Mark as watched updates the watched status button", () => {
        render(<App />);
        const markAsWatchedButton = screen.getAllByRole("button", {
            name: /Mark as watched/i,
        })[0];
        //Click Mark as Watched
        userEvent.click(markAsWatchedButton);

        const notLikedButton = screen.getByRole("button", {
            name: /Not liked/i,
        });
        //If liked, the button should be not liked by default (its just how its coded to be)
        expect(notLikedButton).toBeInTheDocument();
    });

    test("Click Edit then Save returns to view mode", () => {
        render(<App />);
        const editButtons = screen.getAllByRole("button", { name: /Edit/i });
        const editButton = editButtons[0];
        userEvent.click(editButton);
        //Get edit and click

        const saveButton = screen.getByRole("button", { name: /Save/i });
        userEvent.click(saveButton);
        //Get save and click

        const editButtonAfter = screen.getAllByRole("button", {
            name: /Edit/i,
        })[0];
        //Edit button after exists since save is clicked
        expect(editButtonAfter).toBeInTheDocument();
    });

    test("Clicking edit and then Delete removes the first movie", () => {
        render(<App />);
        const movieHeadingsBefore = screen.getAllByRole("heading", {
            level: 3,
        });
        const firstMovieTitle = movieHeadingsBefore[0].textContent;
        //Get the third movie heading and firstmovie title
        const editButtons = screen.getAllByRole("button", { name: /Edit/i });
        const editButton = editButtons[0];
        userEvent.click(editButton);
        //Click an edit button
        const deleteButtons = screen.getAllByRole("button", {
            name: /Delete/i,
        });
        const deleteButton = deleteButtons[0];
        userEvent.click(deleteButton);
        //Click delete
        const movieHeadingsAfter = screen.getAllByRole("heading", { level: 3 });
        expect(movieHeadingsAfter.length).toBe(movieHeadingsBefore.length - 1);
        //Now that firstmovie is deleted, it should NOT be in the document. Also levels should drop by 1 since one movie is missing.
        expect(
            screen.queryByText(firstMovieTitle || ""),
        ).not.toBeInTheDocument();
    });
});
