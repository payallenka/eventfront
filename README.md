# Event Management Dashboard – Frontend
IMP: The frontend might take long to load the first time as the backend(deployed on render) goes in cool mode you might have to wait for 5 minutes for the first time :( then realtime updates:) && In case the register/login gives an error raise an issue to ping me (it's due to supabase free teir DB exhaustion, we just need to change the creds)

## Overview
This is the React-based frontend for the Event Management Dashboard. It allows users to manage events, attendees, and tasks with a responsive and user-friendly interface.

## Video For Reference
[![Watch the demo](https://img.youtube.com/vi/3IJ_py7Pgws/0.jpg)](https://youtu.be/3IJ_py7Pgws)




## Features
- View, add, edit, and delete events
- View and manage attendees
- Assign attendees to events and tasks
- Track tasks and update their status
- Calendar view for events
- Progress visualization for tasks
- Authentication (login/register)
- Real-time updates via WebSockets

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - If needed, create a `.env` file for API URLs or keys.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `src/components/` – React components (EventManager, AttendeeManager, TaskManager, etc.)
- `src/pages/` – Main pages (EventsPage, AttendeesPage, TasksPage, MainApp)
- `src/contexts/` – Context providers (AuthContext)
- `src/hooks/` – Custom hooks (useWebSocket, useResponsive)
- `src/utils/` – Utility functions

## API Integration
- The frontend communicates with the backend REST API for all data operations.
- API endpoints are configured to use `localhost` by default.

## Form Validation
- All forms validate required fields and date formats before submission.

## Authentication
- Users must log in to access the dashboard.
- Registration and login handled via dedicated pages.

## Real-Time Updates
- Task progress and updates are reflected in real time using WebSockets.

## Additional Components

- **EventPage (Extension):**  
  The codebase includes an `EventPage.jsx` component, which provides an alternative, list-style view for events, attendees, and tasks. While not currently used in the main navigation, it serves as a foundation for future enhancements, such as a more detailed event dashboard or admin panel.

## Future Work

- Integrate `EventPage.jsx` as an advanced event dashboard or admin view.
- Add notifications for task deadlines and event reminders.
- Improve accessibility and add more comprehensive error handling.
- Support for file uploads (e.g., event images, attendee avatars).
- Add user profile management and role-based permissions.
- Enhance calendar view with drag-and-drop event/task management.
- Add analytics and reporting features.
- Implement user-specific task and event views (code for user-specific filtering exists in `UserTaskManager.jsx` but is not currently active in the main UI).

## Current Limitations

- The UI, while responsive, may need further accessibility improvements.
- No support for recurring events or multi-day events.
- No email or push notification integration.
- Limited user roles (admin/user) and no granular permissions.
- No support for offline usage or PWA features.

## Evaluator Instructions

1. **Register as an Admin:**
   - On the login page, register a new account and select the admin role (if available).
   - Admins can create, edit, and delete events, attendees, and tasks.

2. **Register as a User:**
   - Log out and register a new account as a regular user.
   - Users can view all events and all tasks, and update task status.

3. **Test Functionality:**
   - As an admin, perform event, attendee, and task management actions.
   - As a user, verify you can view and update all tasks (not just your own).
   - All changes should reflect in real time for both roles.

4. **Switch Roles:**
   - Log in and out to switch between admin and user accounts to observe role-based access and UI changes.
