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
   git clone https://github.com/trendswave/measuremate.git
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

5. Start the backend server:

cd client
npm start

# Usage
1. Open your browser and navigate to http://localhost:3000.
2. Register a new user or log in with existing credentials.
3. Add, edit, and view measurements.
4. Use the query feature to ask fashion-related questions.

# API Endpoints
- User Registration: POST /api/register
- User Login: POST /api/login
- User Profile: GET /api/profile
- Edit Profile: PUT /api/profile
- Add Measurement: POST /api/measurements
- Edit Measurement: PUT /api/measurements/:id
- View Measurement: GET /api/measurements/:id
- View Query History: GET /api/queries
- Superuser Create: POST /api/superuser/create
- Superuser Dashboard: GET /api/superuser/dashboard

# Project Structure

measuremate/
├── client/                 # Frontend code (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                 # Backend code (Node.js, Express)
│   ├── Config
│   ├── ...
│   ├── .env
│   ├── index.js
│   ├── server.js
│   ├── package.json
│   └── gitignore
│   ├──LINCENSE
│   └──...  
├── README.md


# Contributing
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request.

# License
This project is licensed under the MIT License - see the LICENSE file for details.


### Explanation

1. **Project Description**:
   - A brief overview of what MeasureMate is and its purpose.

2. **Table of Contents**:
   - A list of sections included in the README for easy navigation.

3. **Features**:
   - A list of key features provided by the application.

4. **Technologies Used**:
   - A list of technologies and third-party services used in the project.

5. **Installation**:
   - Step-by-step instructions on how to set up the project locally.

6. **Usage**:
   - Instructions on how to use the application after setting it up.

7. **API Endpoints**:
   - A list of available API endpoints with brief descriptions.

8. **Project Structure**:
   - An overview of the project's directory structure.

9. **Contributing**:
   - Guidelines for contributing to the project.

10. **License**:
    - Information about the project's license.

By following this structure, you can provide a comprehensive and clear README file for your MeasureMate project. If you need further assistance with any specific part of the README or the project, please let me know.
### Explanation

1. **Project Description**:
   - A brief overview of what MeasureMate is and its purpose.

2. **Table of Contents**:
   - A list of sections included in the README for easy navigation.

3. **Features**:
   - A list of key features provided by the application.

4. **Technologies Used**:
   - A list of technologies and third-party services used in the project.

5. **Installation**:
   - Step-by-step instructions on how to set up the project locally.

6. **Usage**:
   - Instructions on how to use the application after setting it up.

7. **API Endpoints**:
   - A list of available API endpoints with brief descriptions.

8. **Project Structure**:
   - An overview of the project's directory structure.

9. **Contributing**:
   - Guidelines for contributing to the project.

10. **License**:
    - Information about the project's license.

By following this structure, you can provide a comprehensive and clear README file for your MeasureMate project. If you need further assistance with any specific part of the README or the project, please let me know.