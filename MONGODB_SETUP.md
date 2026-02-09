# MongoDB Setup Guide for Tambo Dashboard

This guide explains how to set up MongoDB for the Tambo AI dashboard system with habit tracking, job applications, and code issue management.

## Prerequisites

- MongoDB Atlas account (recommended) or local MongoDB installation
- Node.js project with the following dependencies installed:
  - `mongodb`
  - `mongoose` (optional, for ODM support)

## Environment Setup

### 1. Create MongoDB Database

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database named `tambo_dashboard`
4. Get your connection string

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `tambo_dashboard`

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# MongoDB Connection
NEXT_MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/tambo_dashboard?retryWrites=true&w=majority

# Tambo API Key (existing)
NEXT_PUBLIC_TAMBO_API_KEY=your-tambo-api-key-here
```

**MongoDB URL Formats:**
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/tambo_dashboard?retryWrites=true&w=majority`
- Local: `mongodb://localhost:27017/tambo_dashboard`

## Database Collections

The system automatically creates these collections:

### Habits System
- **`habits`** - Habit definitions
- **`habit_entries`** - Daily habit completion records

### Job Tracking System  
- **`jobs`** - Job applications
- **`job_interviews`** - Interview records
- **`job_activities`** - Activity timeline

### Code Issues System
- **`code_issues`** - Bug reports and issues
- **`code_issue_comments`** - Issue comments
- **`code_issue_resolution_steps`** - Resolution steps

## Testing Database Connection

### API Test Endpoint

Visit: `http://localhost:3000/api/test`

This will:
- Test database connection
- List available collections
- Test each service (habits, jobs, issues)
- Return status for each component

### Manual Testing

```bash
# Test database connection
curl http://localhost:3000/api/test

# Create test data
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-test-habit",
    "data": { "habitName": "Morning Workout" }
  }'

curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-test-job", 
    "data": {
      "company": "Google",
      "role": "Software Engineer",
      "location": "Remote"
    }
  }'

curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create-test-issue",
    "data": {
      "title": "Fix login bug",
      "description": "Users cannot login with Google OAuth"
    }
  }'
```

## Using the Services

### 1. Habit Tracking

```javascript
import { HabitService } from '@/services/habitService';

// Create habit
const habit = await HabitService.createHabit({
  habitName: 'Daily Coding',
  initialDate: '2024-01-01'
});

// Mark habit complete for today
await HabitService.markHabitCompleted('Daily Coding', 1);

// Mark habit missed with reason
await HabitService.markHabitCompleted('Daily Coding', 0, 'Too busy');

// Get habit statistics
const stats = await HabitService.getHabitStats(habitId, 30); // last 30 days
```

### 2. Job Applications

```javascript
import { JobService } from '@/services/jobService';

// Create job application
const job = await JobService.createJob({
  company: 'Google',
  role: 'Software Engineer',
  status: 'Applied',
  location: 'Remote',
  notes: 'Applied through careers page'
});

// Update status
await JobService.updateJobStatus(jobId, 'Interview');

// Get job statistics
const stats = await JobService.getJobStats();
```

### 3. Code Issues

```javascript
import { CodeIssueService } from '@/services/codeIssueService';

// Create issue
const issue = await CodeIssueService.createCodeIssue({
  issueId: 'BUG-001',
  title: 'Login not working',
  description: 'Users cannot authenticate',
  source: 'github',
  priority: 'high',
  labels: ['auth', 'bug']
});

// Add resolution steps
await CodeIssueService.addResolutionStep({
  issueId: issue._id,
  step: 'Check OAuth configuration'
});

// Update issue status
await CodeIssueService.changeStatus(issueId, 'resolved');
```

### 4. Dashboard Data

```javascript
import { DashboardService } from '@/services/dashboardService';

// Get complete dashboard
const dashboard = await DashboardService.getDashboardData();

// Get summary only
const summary = await DashboardService.getDashboardSummary();

// Get recent activities
const activities = await DashboardService.getRecentActivities(10);
```

## Tambo AI Integration

The services are integrated with Tambo AI through tools in `src/lib/tambo.ts`:

### Available Tools
- **`createHabitTracker`** - Creates new habit
- **`createJobTracker`** - Creates job application  
- **`createIssueTracker`** - Creates code issue
- **`buildDashboard`** - Builds complete dashboard
- **`analyzeHabit`** - Analyzes habit patterns
- **`analyzeCodeIssue`** - Analyzes code issues
- **`analyzeJobRejections`** - Analyzes job rejections

### Available Components
- **`DevDashboard`** - Main dashboard UI
- **`HabitCard`** - Individual habit tracker
- **`JobTrackerCard`** - Job application card
- **`IssueTrackerCard`** - Code issue card
- **`HabitAnalyzer`** - Habit analysis UI
- **`CodeIssueAnalyzer`** - Issue analysis UI
- **`JobRejectionAnalyzer`** - Rejection analysis UI

## Usage Examples

### Chat Commands

**Create Habit:**
```
"I want to track a new habit: Daily Meditation"
```

**Create Job Application:**
```
"I applied to Google for a Software Engineer position, status Applied"
```

**Create Code Issue:**
```
"There's a bug in the login system - users can't authenticate with OAuth"
```

**Build Dashboard:**
```
"Show me my dashboard" or "Build my system overview"
```

### Data Analysis

**Analyze Habits:**
```
"Analyze my Daily Meditation habit for the last 30 days"
```

**Analyze Job Search:**
```
"Show me rejection patterns in my job applications"
```

**Analyze Issues:**
```
"Analyze the login bug issue and create resolution steps"
```

## Troubleshooting

### Connection Issues
1. Check MongoDB URL in `.env.local`
2. Verify network access (Atlas IP whitelist)
3. Check database name matches (`tambo_dashboard`)

### Permission Errors
1. Verify database user permissions
2. Check if user can read/write to database

### Missing Collections
Collections are created automatically on first use. If issues persist:
1. Check database connection
2. Verify user has createCollection permissions

### Data Not Appearing
1. Test API endpoint: `/api/test`
2. Check browser console for errors
3. Verify Tambo tools are properly registered

## Production Considerations

### Security
- Use MongoDB Atlas for production
- Enable authentication
- Use connection string with restricted permissions
- Set up IP whitelisting

### Performance
- Index frequently queried fields
- Consider data archiving for old records
- Monitor database performance

### Backup
- Enable Atlas automated backups
- Regular data exports using dashboard export feature
- Test backup restoration procedures

## Support

For issues:
1. Check the API test endpoint first
2. Review browser console logs  
3. Check MongoDB connection and permissions
4. Verify environment variables are set correctly