require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());


const pool = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `<span cklass="math-inline"></span>{req\.user\.id\}-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


const SECRET_KEY = SECRET_KEY;

const SPREADSHEET_ID = SPREADSHEET_ID;
const SHEET_NAME = SHEET_NAME;


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'config', 'service-account-key.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function appendToGoogleSheet(data) {
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'sheet1!A2:Z',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [data],
    },
    auth: authClient,
  };
  try {
    await sheets.spreadsheets.values.append(request);
    console.log('Data appended to Google Sheet');
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
  }
}

async function updateGoogleSheet(measurementId, data) {
  const authClient = await auth.getClient();
  const getRowsRequest = {
    spreadsheetId: SPREADSHEET_ID,
    range: `sheet1!A:Z`,
    auth: authClient,
  };

 try {
    const response = await sheets.spreadsheets.values.get(getRowsRequest);
    const rows = response.data.values;
    const rowIndex = rows.findIndex(row => row[0] === measurementId.toString());

    if (rowIndex === -1) {
      console.error('Measurement ID not found in Google Sheet');
      return;
    }  

const updateRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: `sheet1!A${rowIndex + 1}:Z${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
      auth: authClient,
    };

       await sheets.spreadsheets.values.update(updateRequest);
    console.log('Data updated in Google Sheet');
  } catch (error) {
    console.error('Error updating data in Google Sheet:', error);
  }
}

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  try {
     const decodedToken = jwt.verify(token, 'your_secret_key');
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// API endpoint to retrieve user profile
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT username, email, profile_picture FROM users WHERE id = ?', [req.user.id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ error: 'Error retrieving profile' });
  }
});


// API endpoint to retrieve user measurements
app.get('/api/measurements', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM measurements WHERE user_id = ?', [req.user.id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving measurements:', error);
    res.status(500).json({ error: 'Error retrieving measurements' });
  }
});



// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});