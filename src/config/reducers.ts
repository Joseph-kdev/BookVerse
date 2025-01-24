import { GoogleBook, User } from "../types";

export const booksReducer = (books: GoogleBook[] , action) => {
  switch (action.type) {
    case "GENRE-CHANGE":
      return [...action.payload];
    case "Error":
      return []
    default:
      return books;
  }
}

export const userReducer = (user: User, action) => {
    switch (action.type) {
        case "email-entered":
            return { ...user, email: action.payload }
        case "password-entered":
            return { ...user, password: action.payload }
        case "has-account":
            return { ...user, hasAccount: !user.hasAccount }

        default:
            throw new Error()
    }
}