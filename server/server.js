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

// API endpoint to add a new measurement
app.post('/api/measurements', authenticate, async (req, res) => {
  const { name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO measurements (user_id, name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber]
    );
    const measurementId = result.insertId;
    // Append data to Google Sheet
    const username = req.user.username;
    const data = [measurementId,  name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber];
    await appendToGoogleSheet(data);
    res.status(201).json({ message: 'Measurement added successfully' });
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({ error: 'Error adding measurement' });
  }
});


// API endpoint to edit an existing measurement
app.put('/api/measurements/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber } = req.body;
  try {
    await pool.query(
      'UPDATE measurements SET name = ?, chest = ?, belly = ?, shoulder = ?, sleeve = ?, hip = ?, armhole = ?, cufflinks = ?, muscle = ?, neck = ?, length = ?, waist = ?, thigh = ?, knee = ?, bottom = ?, agbada = ?, cap = ?, phoneNumber = ? WHERE id = ? AND user_id = ?',
      [name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber, id, req.user.id]
    );
    // Update data in Google Sheet
    const username = req.user.username;
    const data = [ id, name, chest, belly, shoulder, sleeve, hip, armhole, cufflinks, muscle, neck, length, waist, thigh, knee, bottom, agbada, cap, phoneNumber];
    await updateGoogleSheet(id, data);
    res.status(200).json({ message: 'Measurement updated successfully' });
  } catch (error) {
    console.error('Error updating measurement:', error);
    res.status(500).json({ error: 'Error updating measurement' });
  }
});


// API endpoint to update user profile
app.put('/api/profile', authenticate, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, req.user.id]);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// API endpoint to update user profile picture
app.put('/api/profile-picture', authenticate, async (req, res) => {
  const profilePicture = req.files.profilePicture;
  const profilePicturePath = `/uploads/${profilePicture.name}`;
  try {
    await profilePicture.mv(`./public${profilePicturePath}`);
    await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePicturePath, req.user.id]);
    res.status(200).json({ profilePicture: profilePicturePath });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Error updating profile picture' });
  }
});

// API endpoint to delete user profile
app.delete('/api/profile', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Error deleting account' });
  }
});


// User registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    const user = { id: result.insertId, username, email };
    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email or username already exists' });
    } else {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user.id });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Update user profile
app.put('/api/profile', authenticate, upload.single('profilePicture'), async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 8) : undefined;
  let profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ?, password = COALESCE(?, password), profile_picture_url = COALESCE(?, profile_picture_url) WHERE id = ?',
      [username, email, hashedPassword, profilePictureUrl, req.user.id]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
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