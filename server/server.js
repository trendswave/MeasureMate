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

