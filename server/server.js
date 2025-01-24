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
