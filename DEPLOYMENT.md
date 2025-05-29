# Deployment Guide: Netlify + Supabase

## Overview
This guide will help you deploy the Carbon Footprint Calculator to Netlify with Supabase as the database, providing permanent free hosting.

## Prerequisites
- GitHub account (to connect your repository)
- Netlify account (free)
- Supabase account (free)
- Gmail account with App Password for email functionality

## Step 1: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization and set:
   - Project name: `carbon-calculator` (or your preference)
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to your users
4. Wait for the project to be created (2-3 minutes)
5. Go to Settings → Database
6. Copy the "Connection string" under "Connection pooling"
7. Replace `[YOUR-PASSWORD]` with your database password

Example connection string:
```
postgresql://postgres.abc123:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

## Step 2: Set up Database Schema

1. In your Supabase project, go to SQL Editor
2. Run this SQL command to create the tables:

```sql
-- Create students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create calculations table
CREATE TABLE calculations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  distance REAL NOT NULL,
  transport_method TEXT NOT NULL,
  hydration_habit TEXT NOT NULL,
  packaging_habit TEXT NOT NULL,
  daily_emissions REAL NOT NULL,
  weekly_emissions REAL NOT NULL,
  yearly_emissions REAL NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- Create email_reports table
CREATE TABLE email_reports (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) NOT NULL,
  calculation_id INTEGER REFERENCES calculations(id) NOT NULL,
  email_sent TIMESTAMP DEFAULT NOW(),
  report_data JSONB NOT NULL
);
```

## Step 3: Set up Gmail App Password

1. Go to [Google Account settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate new app password
4. Select "Mail" and "Other (custom name)"
5. Name it "Carbon Calculator"
6. Copy the 16-character password

## Step 4: Deploy to Netlify

1. Push your code to GitHub repository
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Connect your GitHub account and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Step 5: Configure Environment Variables

1. In your Netlify site dashboard, go to Site settings → Environment variables
2. Add these variables:

```
DATABASE_URL=postgresql://postgres.abc123:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-16-char-app-password
```

## Step 6: Update Site Settings

1. Go to Site settings → Functions
2. Functions directory should be: `netlify/functions`
3. Go to Site settings → Build & deploy
4. Build command: `npm run build`
5. Publish directory: `dist`

## Step 7: Test the Deployment

1. Visit your Netlify site URL
2. Test the calculator functionality
3. Test email reports with a real email address
4. Check Supabase database for stored data

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure password in URL is URL-encoded if it contains special characters

### Email Issues
- Verify Gmail App Password is correct
- Check GMAIL_USER is the full email address
- Ensure 2-Step Verification is enabled in Gmail

### Build Issues
- Check Netlify deploy logs for errors
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility

## Post-Deployment

1. Set up custom domain (optional)
2. Configure SSL (automatic with Netlify)
3. Set up monitoring and analytics
4. Regular database backups (Supabase handles this automatically)

---

Your Carbon Footprint Calculator is now deployed with permanent free hosting!