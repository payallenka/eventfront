# Event Management Dashboard – Frontend

## Overview
This is the React-based frontend for the Event Management Dashboard. It allows users to manage events, attendees, and tasks with a responsive and user-friendly interface.

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

## Current Limitations

- The UI, while responsive, may need further accessibility improvements.
- No support for recurring events or multi-day events.
- No email or push notification integration.
- Limited user roles (admin/user) and no granular permissions.
- No support for offline usage or PWA features.
