# Ed-Tech Platform

## Overview

This is a comprehensive ed-tech platform built with React, Node.js, Express, and Tailwind CSS. The application provides a dynamic learning environment where teachers can post and manage their courses, students can browse and purchase courses, and administrators can monitor and oversee the entire platform. It incorporates payment verification and user management to ensure a seamless and secure experience.

## Features

- **Teacher Dashboard**: Allows teachers to create, update, and manage their courses.
- **Student Portal**: Enables students to browse, purchase, and access courses.
- **Admin Panel**: Provides tools for administrators to monitor and manage the platform.
- **Payment Integration**: Secure payment processing for course purchases via Razorpay.
- **Responsive Design**: Built with Tailwind CSS to ensure a modern and responsive user experience.
- **Email Notifications**: Utilizes Gmail APIs to send notifications to users for signup, signin, and course purchases.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Payment Integration**: Razorpay
- **Email Notifications**: Gmail APIs

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Gmail API credentials for email notifications

### Installation

1. **Clone the repository:**

   Clone the repository and navigate to the project directory.

2. **Install dependencies:**

   For the frontend, navigate to the `client` directory and install the required dependencies.

   For the backend, navigate to the `server` directory and install the required dependencies.

3. **Run the application:**

   Start the backend server and the frontend development server. Open `http://localhost:3000` in your browser to view the application.


### Install dependencies:

For the frontend:
``` bash
cd client
npm install
```

For the backend:
```bash
cd server
npm install
```

### Configure environment variables:

Create a .env file in the server directory and add the following environment variables:

```env
Copy code
MAIL_HOST=
MAIL_USER=
MAIL_PASS=
JWT_SECRET=
FOLDER_NAME=
RAZORPAY_KEY=
RAZORPAY_SECRET=
MONGODB_URL= # Connection string for MongoDB
CLOUD_NAME=
API_KEY= # Gmail API key for mailing
API_SECRET= # Gmail API secret for mailing
PORT=
```


 - MAIL_HOST, MAIL_USER, and MAIL_PASS: Configuration for the mail server.

 - JWT_SECRET: Secret key for JSON Web Token.

 - FOLDER_NAME: Name of the folder where files are stored.

 - RAZORPAY_KEY and RAZORPAY_SECRET: Credentials for Razorpay payment gateway.

 - MONGODB_URL: Connection string for MongoDB.

 - CLOUD_NAME: Cloudinary 
 
 - API_KEY, and API_SECRET: Configuration used for email notifications.

 - PORT: Port on which the server will run.

### Run the application:

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend development server:

```bash
npm start
```

Open http://localhost:3000 in your browser to view the application.


## Usage

- **Teacher Login**: Use the teacher credentials to access the teacher dashboard and manage courses.
- **Student Login**: Use the student credentials to browse and purchase courses.
- **Admin Login**: Use the admin credentials to access the admin panel and oversee the platform.

## Contributing

We welcome contributions to this project. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes (`Add some feature`).
4. Push to the branch.
5. Create a new Pull Request.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/)
- [MongoDB](https://www.mongodb.com/)

## Contact

For any questions or inquiries, please reach out to works.mayank27@gmail.com or open an issue on the [GitHub repository](https://github.com/Bansal0527/Ed-tech-project-).
