SiteSpotter - Field Reporting PWA
SiteSpotter is a Progressive Web Application (PWA) designed for field reporting, allowing users to document site observations, maintenance issues, hazards, and other environmental concerns with support for offline operation.

<img alt="SiteSpotter Screenshot" src="https://example.com/screenshots/siteSpotter.png">
Features
Create detailed reports with titles, descriptions, categories, and priority levels
Capture photos directly within the application
Record GPS coordinates automatically
Work offline with full data synchronization when back online
Filter reports by status and priority
Installable PWA with home screen icon
Demo
Try the live demo at: https://sitespotter.example.com

Installation Options
Method 1: Installing as a PWA (Recommended)
Visit the SiteSpotter website in Chrome, Edge, or Safari: https://sitespotter.example.com
Wait for the page to fully load
Look for the install prompt in your browser:
Chrome/Edge: Click the "Install" button in the address bar
Safari (iOS): Tap the share button, then "Add to Home Screen"
Follow the on-screen instructions
The app will appear on your home screen as "SiteSpotter"
Method 2: Running Locally
Prerequisites
Node.js (v16 or newer)
npm or yarn
Setup
Clone the repository

Navigate to the project directory

Install dependencies

Start the development server

Open your browser and visit http://localhost:5173

Building for Production
The build output will be in the dist directory.

Usage Guide
Creating a Report
Open the SiteSpotter application
Fill out the report form:
Title and description
Select a category (Maintenance, Wildlife, Hazard, or Vandalism)
Set priority level
To add a photo, click "Take Photo" and use your device camera
Submit the report
Managing Reports
Use the filter buttons to view specific types of reports (All, Pending, Resolved, Urgent)
Click on a report's "Mark as Resolved" button to change its status
Delete reports with the "Delete" button
View full-size images by clicking on them
Offline Usage
SiteSpotter works fully offline:

The app will indicate offline status
Reports created offline will be synchronized automatically when connection is restored
All data is stored locally on your device
Technology Stack
React 19
Vite 6
PWA features with service workers
LocalStorage for offline data persistence
Camera and Geolocation APIs
Privacy & Data Storage
All data is stored locally on your device
Photos are converted to data URLs and stored in LocalStorage
GPS coordinates are only captured when you create a report
No analytics or tracking scripts are included
Contributing
Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add some amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
Project Link: https://github.com/username/siteSpotter