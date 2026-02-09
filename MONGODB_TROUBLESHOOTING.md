# MongoDB Troubleshooting Guide

This guide helps resolve the MongoDB connection error you encountered: **"Module not found: Can't resolve 'net'"**

## ❌ The Problem

The error occurs because MongoDB's Node.js driver tries to import server-only modules (like `net`, `fs`, `crypto`) that aren't available in the browser environment. Next.js tries to bundle everything for both server and client, causing this conflict.

## ✅ Solutions Applied

### 1. Next.js Configuration Updates
The `next.config.ts` has been updated with:

```typescript
// Enhanced webpack configuration for MongoDB compatibility
webpack: (config, { isServer }) => {
  // Only apply client-side MongoDB exclusions for browser builds
  if (!isServer) {
    // Exclude MongoDB and related packages from client bundle
    config.resolve.fallback = {
      net: false,
      dns: false,
      tls: false,
      fs: false,
      crypto: false,
      // ... other Node.js modules
      mongodb: false,
    };
  }
  return config;
},

// Server external packages for better performance
serverExternalPackages: ["mongodb", "mongoose"],
```

### 2. Server-Side Only Checks
All MongoDB services now include server-side validation:

```javascript
// Ensure this only runs on server side
if (typeof window !== "undefined") {
  throw new Error("MongoDB should only be used on server side");
}
```

### 3. Fallback Data System
If MongoDB connection fails, the system provides mock data to keep the application functional.

## 🔧 Setup Instructions

### Step 1: Environment Configuration
Create or update `.env.local` in your project root:

```env
# MongoDB Connection (Required)
NEXT_MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/tambo_dashboard?retryWrites=true&w=majority

# Tambo API Key (Required)  
NEXT_PUBLIC_TAMBO_API_KEY=your-actual-tambo-api-key-here
```

### Step 2: MongoDB Setup Options

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free account and cluster
3. Create database: `tambo_dashboard`
4. Get connection string and add to `.env.local`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use local connection string:
   ```env
   NEXT_MONGO_URL=mongodb://localhost:27017/tambo_dashboard
   ```

### Step 3: Test the Setup

**Start the development server:**
```bash
npm run dev
```

**Test the API endpoint:**
```bash
# Test database connection
curl http://localhost:3000/api/test

# Expected response (if MongoDB connected):
{
  "success": true,
  "message": "Database connection and services test completed",
  "data": {
    "connection": "success",
    "collections": [...],
    "services": {
      "habits": { "status": "success", "count": 0 },
      "jobs": { "status": "success", "count": 0 },
      "issues": { "status": "success", "count": 0 }
    }
  }
}
```

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to connect to localhost port 3000"
**Cause:** Development server not running
**Solution:** 
```bash
npm run dev
```

### Issue 2: "MongoDB connection failed"
**Causes & Solutions:**
- **Missing .env.local file**: Create file with MongoDB URL
- **Wrong MongoDB URL format**: Use `mongodb://` or `mongodb+srv://`
- **Network access (Atlas)**: Add IP to whitelist in Atlas
- **Wrong credentials**: Verify username/password in connection string

### Issue 3: "Please add your MongoDB URI"
**Solution:** Add `NEXT_MONGO_URL` to `.env.local`

### Issue 4: "Module not found: Can't resolve 'net'"
**Solution:** Already fixed in `next.config.ts`. If still occurring:
1. Delete `.next` folder: `rm -rf .next`
2. Restart dev server: `npm run dev`

### Issue 5: Components showing empty data
**Causes:**
- MongoDB not connected (using fallback data)
- No data in database yet
**Solutions:**
- Verify MongoDB connection via `/api/test`
- Create test data via chat or API

## 📊 Testing Database Connection

### Method 1: API Endpoint
Visit: `http://localhost:3000/api/test`

### Method 2: Create Test Data
```bash
# Create test habit
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"action": "create-test-habit", "data": {"habitName": "Daily Coding"}}'

# Create test job
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"action": "create-test-job", "data": {"company": "Google", "role": "Developer"}}'

# Create test issue  
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"action": "create-test-issue", "data": {"title": "Test Bug", "description": "Sample issue"}}'
```

### Method 3: Environment Check
The system includes built-in environment validation. Check browser console for environment reports.

## 🔍 Debug Steps

### 1. Check Environment Variables
```bash
# Verify .env.local exists and has correct variables
cat .env.local
```

### 2. Verify MongoDB URL Format
Valid formats:
```
# Atlas
mongodb+srv://user:pass@cluster.mongodb.net/tambo_dashboard?retryWrites=true&w=majority

# Local
mongodb://localhost:27017/tambo_dashboard

# With auth
mongodb://username:password@localhost:27017/tambo_dashboard
```

### 3. Test MongoDB Connection Directly
Use MongoDB Compass or mongo shell:
```bash
# Test connection
mongosh "your-connection-string-here"
```

### 4. Check Server Logs
Development server logs will show:
- MongoDB connection attempts  
- Service initialization status
- Error details

### 5. Browser Console
Check for:
- Environment validation messages
- Client-side errors
- Fallback data usage

## 🎯 Working Without MongoDB

The system is designed to work with fallback data if MongoDB isn't available:

1. **Tambo Tools**: Return mock data instead of database data
2. **Dashboard**: Shows sample habits, jobs, and issues  
3. **Components**: Function normally with placeholder data
4. **No Errors**: System continues to work for development/testing

## 📱 Chat Commands

Once MongoDB is connected, use these chat commands:

```
"I want to track a new habit: Morning Workout"
"I applied to Google for Software Engineer position"
"There's a bug in the login system - users can't authenticate"
"Show me my dashboard"
"Analyze my Morning Workout habit"
```

## 📞 Support

If issues persist:

1. **Check Next.js version**: Should be 15.x
2. **Node.js version**: Should be 18+ or 20+
3. **Clear cache**: `rm -rf .next node_modules && npm install`
4. **Verify MongoDB Atlas settings**: IP whitelist, user permissions
5. **Test connection outside app**: Use MongoDB Compass

The system is designed to be resilient - it will work with mock data even if MongoDB connection fails, allowing you to develop and test the Tambo AI integration while resolving database issues.