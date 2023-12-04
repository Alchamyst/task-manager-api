# Task Manager RESTFul-API

An API designed to be used as the back end of a task manager app.
Users must register for a new account in order create and manage tasks.

This api was built using **NODE JS** and **MongoDB**, following a **RESTFul API** design architecture. 
The app also sends an email notification upon registration and deactivation of the user's account.

## Features

- Authentication and Security
- Sorting, Pagination, and Filtering
- Sending Emails
- Avatar upload
- Containerised to allow simple deployment and testing within Docker using docker-compose.yml

## API Endpoints

| Methods | Endpoints                  | Access  | Description                              | Request Body Parameters      |
| ------- | -------------------------- | ------- | ---------------------------------------- | ---------------------------- |
| POST    | /users                     | Public  | Create New User Account                  | name, email, password        |
| POST    | /users/login               | Public  | Login User                               | name, password               |
| GET     | /users/me                  | Private | Read Profile                             | -                            |
| PATCH   | /users/me                  | Private | Update Profile                           | name, email, password        |
| POST    | /users/me/avatar           | Private | Upload Profile Picture                   | avatar                       |
| GET     | /users/userID/avataar      | Private | View Profile Picture of a User           | -                            |
| DELETE  | /users/me/avatar           | Private | Delete Profile Picture                   | -                            |
| DELETE  | /users/me                  | Private | Delete User Account                      | -                            |
| POST    | /users/tasks               | Private | Create a Task                            | description, completed       |
| GET     | /users/tasks/taskID        | Private | View a Task                              | -                            |
| GET     | /users/tasks               | Private | View all Tasks                           | *see below for query params* |
| PATCH   | /users/tasks/taskID        | Private | Update a Task                            | description, completed       |
| DELETE  | /users/tasks/taskID        | Private | Delete a Task                            | -                            |
| POST    | /users/logout              | Private | Logout an account                        | -                            |
| POST    | /users/logoutall           | Private | Logout all accounts                      | -                            |

Note: For *PATCH* only the parameter(s) which are being updated are required.

For the *GET /tasks* endpoint a number of query strings are accepted to filter results:

| Query                    | Description                                                            | 
| ------------------------ | ---------------------------------------------------------------------- |
| ?completed=true          | Returns list of completed tasks.                                       |
| ?limit=2                 | Limit number of return results to 2.                                   | 
| ?skip=3                  | Used for pagination: skip first 3 results.                             | 
| ?sortBy=createdAt:asc    | Returned data is sorted by creation date in ascending order.           | 
| ?sortBy=createdAt:desc   | Returned data is sorted by creation date in ascending order.           | 


## Hosted Domain Link

You can test this API out at: [https://taskmanager.alchamyst.com/api](https://taskmanager.alchamyst.com/api)