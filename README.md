# MeasureMate

MeasureMate is a comprehensive solution for managing body measurements and interacting with fashion-related queries using OpenAI. Users can register, log in, add, edit, and view their measurements. The app also provides an interactive platform for users to ask fashion-related questions and view their query history.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and login
- User profile management
- Add, edit, and view measurements
- Integration with Google Sheets for storing measurements
- Integration with OpenAI API for fashion-related queries
- View query history
- Send generated responses to WhatsApp

## Technologies Used
- **Backend**: Node.js, Express.js, MySQL, Google Sheets API, OpenAI API
- **Frontend**: React, Axios, React Router
- **Authentication**: bcryptjs, jsonwebtoken

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/measuremate.git
   cd measuremate

2. Install backend dependencies:

npm install

3. Install frontend dependencies:

cd client
npm install

4. Set up environment variables:

Create a .env file in the root directory and add the following:


PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=measuremate_db
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY_FILE=path_to_your_google_api_key_file
SPREADSHEET_ID=your_google_sheet_id
SHEET_NAME=Sheet1
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
