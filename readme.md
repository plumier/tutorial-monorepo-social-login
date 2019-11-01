# Plumier Social Login Example 
This example explains how to use Plumier social login middleware. 

## Stack 
This example created using `monorepo-plumier-react` starter. 

* React as the frontend 
* Plumier as the backend 
* MongoDB database using Mongoose and `@plumier/mongoose` helper 
* Github actions (CI)
* Heroku automatic deployment (CD)

## Important Setup & Best Practices 

### Frontend
* **For SPA don't store JWT token on storage**, Instead store JWT token on cookie with option `HttpOnly` and `SameSite`, see it [here](https://github.com/plumier/tutorial-monorepo-social-login/blob/018025a8ea9c5f94934f354c78d5b5d802782c21/packages/server/src/controller/auth-controller.ts#L23)
* Handle social login dialog after login completed, see [here](https://github.com/plumier/tutorial-monorepo-social-login/blob/018025a8ea9c5f94934f354c78d5b5d802782c21/packages/ui/src/page/LoginPage.tsx#L11), Cookie automatically set on the opened dialog, no further process required to store the token
  

### Backend


* Create custom authorization to secure some `/users` route to make it accessible only to `Admin` or `Owner`, see it [here](https://github.com/plumier/tutorial-monorepo-social-login/blob/018025a8ea9c5f94934f354c78d5b5d802782c21/packages/server/src/controller/api/v1/users-controller.ts#L6)
* Reuse a controller to handle two routes `/users/:id` and `/users/me`, see it [here](https://github.com/plumier/tutorial-monorepo-social-login/blob/018025a8ea9c5f94934f354c78d5b5d802782c21/packages/server/src/controller/api/v1/users-controller.ts#L38)
* On Heroku, the HTTPS/SSL defined behind proxy using `x-forwarded-proto`, its required to enable `proxy` like explained [here](packages/server/src/heroku-facility.ts). 
  

## Local Dev Setup
### Prerequisites:
* Node.js >= 10 
* MongoDB
* Yarn

### Clone The Project 

`git clone https://github.com/plumier/tutorial-monorepo-social-login.git`

### Setup Social Login Configuration
Set appropriate value for social login configuration : 
* Front end on `packages/ui/src/config.ts`
* Backend: rename the `.env.example` into `.env` and change the appropriate value.

### Install Packages and Run

* `yarn install` to install dependencies 
* `yarn debug` to start
