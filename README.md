# Upcycle Build Overview
The Upcycle Build application aims to assist those who work in the reuse industry by managing their work all in one place. The app has 3 main functionalities, all of which are connected to a centralized Firestore database:

1) A donation form that logs materials into inventory
2) A filterable list of inventory
3) A calendar for task management

Each of these parts makes up an app that provides a critical service to all of those working in this industry. It replaces their antiquated pen and paper ledger systems and gives them a tool to maximize efficiency and properly measure their environmental impact, a process that is essential for them to gain funding and continue helping the environment.

# Release Notes
### Features
- Donation source tracking (drop-off, pickup, event)
- Material lifecycle tracking
- Category assignment (wood, metals, textiles) to donations
- Expiration dates for perishable items
- Quick removal of items from inventory
- Filtering and sorting systems on materials screen
- Weight field on the donation form to quantify waste diversion
- Downloadable donation receipt
- Google Maps link to address logged in each donation entry
- Pictures can be taken and uploaded in app for each donation
- Material donations can be received into a centralized database
- Ability to log multiple items in the same donation
- App view of all logged donations
- Ability to edit/comment on existing donations
- Buttons for calendar navigation
- Date and Time Picker modals
- Ability to check tasks off
- Registration Screen
- Login Screen
- Account Roles
- Settings Page
- Supports use by organizations and smaller teams within the orgs
- Task management calendar
- Donations populate in calendar
- Authentication
- Firestore Layer

### Known Issues that we have now
- The feature to take pictures and store them for each donation works in the backend logic, but Firebase requires us to get a premium subscription to make a bucket to store images. We have not passed this paywall, and therefore this feature does not currently work in the app. However, a simple proverbial swipe of the credit card will get this feature properly deployed.
- Checkboxes for the calendar show up on web view but not mobile view
- Empty days will not render an agenda list for the items that are within 7 days of them

### Archive of issues we had before but were squashed (refer to bug fixes below)
- Filters might work better as a dropdown menu instead of typing input field
- Materials screen still needs some UI updates
- Logout button in the top right of the screen on materials and receiving tab; should be hamburger menu here instead
- "Remember me" on login does not work (denies login)
- "Loading" icon spins on calendar screen when there are no events for that day
- Calendar brings user to wrong day upon launch
- User authenticated state not persisting between sessions
- No sign up form, date picker modal, or time picker modal
- User cannot scroll to see full materials list

### Bug Fixes
- Filter and sort functionalities work with the click of a button instead of using a typed input field
- Much needed UI updates
- Replaced logout button with hamburger menu
- "Remember me" feature now works
- Fixed "loading" icon bug, now shows message "No events scheduled for today" when day is empty
- Calendar brings user to correct day upon launch
- Authenticated state persists between sessions
- Added sign up form, date picker modal, and time picker modal
- Fixed bug where user could not scroll to see full materials list

### Installation Guide
Attached (https://github.com/cwyner/JIB-4342-RamblinRecyclers/blob/riechert-arthur-installation-guide-1/INSTALLATION.md)[here] is a link to the installation guide that will get you started with running this app on your machine:

### Detailed Design Document
Attached here is a link to the detailed design document for our app, providing a deep dive into the design choices we made along the way:

(https://github.com/cwyner/JIB-4342-RamblinRecyclers/blob/1ebd4ae66becac214cad053951aa13e3e04b4765/Detailed%20Design%20Document%20-%20JIB%204342.pdf)
