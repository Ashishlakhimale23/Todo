# Todo MERN Project

This project is a Todo application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes features such as user authentication using JWT, user authorization, and user validation using Joi. Users can sign in, log in, add todos, delete todos, and mark todos as completed.

## Features

- **Sign In:** Users can sign in to their accounts.
- **Login:** Users can log in to access the application.
- **Add Todo:** Authenticated users can add new todos.
- **Delete Todo:** Users can delete existing todos.
- **Mark Completed:** Users can mark todos as completed.
- **JWT Authentication:** User authentication is handled using JWT tokens.
- **Authorization:** Only authenticated users can access certain routes and perform actions.
- **Joi Validation:** User input is validated using Joi for data integrity and security.

## Installation

1. Clone the repository: `git clone https://github.com/Ashishlakhimale23/Todo-MERN.git`
2. Install dependencies: `npm install`
3. Set up environment variables (e.g., MongoDB URI, JWT secret)
4. Run the backend: `cd todoserver` && `npm start`
5. Run the frontend: `cd frontend && npm run dev`

## Usage

1. Sign in or log in to access the todo list.
2. Add new todos using the input field.
3. Delete todos by clicking the delete button.
4. Mark todos as completed by clicking the tick.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Validation:** Joi

## Future Features

- **Update Todo:** Allow users to update their todos.
- **OTP Validation:** Implement OTP validation for enhanced security.

