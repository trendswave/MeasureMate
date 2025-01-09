require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
// const authenticate = require('./middleware/authenticate');
// const isSuperUser = require('./middleware/isSuperUser');

