# Plumier Social Login Example 
This example explains how to use Plumier social login middleware. 

## Stack 
This example created using `monorepo-plumier-react` starter. Use `npx plumier-starter`

* React as the frontend 
* Plumier as the backend 
* MongoDB database using Mongoose and `@plumier/mongoose` helper 
* Github actions (CI)
* Heroku automatic deployment (CD)
* Monorepo using Yarn workspace

## Security Best Practice 
* For SPA don't store JWT token on localStorage/sessionStorage, Instead store JWT token on cookie with option `HttpOnly` and `SameSite`
* Generate social login dialog url on server side to prevent hardcoded social provider client id  
* Secure social login dialog url with CSRF token on STATE parameter then validate the token on social login callback 
* Authorize endpoint to restrict access to some users
* Validate data to prevent malformed data which will cause unexpected error
* Force HTTPS/SSL on heroku facility

## Local Dev Setup
### Prerequisites:
* Node.js >= 10 
* MongoDB
* Yarn

### Clone The Project 

`git clone https://github.com/plumier/tutorial-monorepo-social-login.git`

### Setup Social Login Configuration
Set appropriate value for social login configuration : 
* Backend: rename the `.env.example` into `.env` and change the appropriate value.

### Install Packages and Run

* `yarn install` to install dependencies 
* `yarn debug` to start
