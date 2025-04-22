# Upcycle Build Overview
The Upcycle Build application aims to assist those who work in the reuse industry by managing their work all in one place. The app has 3 main functionalities, all of which are connected to a centralized Firestore database:

1) A donation form that logs materials into inventory
2) A filterable list of inventory
3) An calendar for task management

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

### Archive of issues we had before but were squashed (refer to bug fixes below)
- Filters might work better as a dropdown menu instead of typing input field
- Materials screen still needs some UI updates
- Logout button in the top right of the screen on materials and receiving tab; should be hamburger menu here instead
- "Remember me" on login does not work (denies login)
- Clicking between days will sometimes show an arbitrary range of days on the preview, not always the 7 days in the we
- "Loading" icon spins on Calendar screen when there are no events for that day
- Calendar brings user to wrong day upon launch
- User authenticated state not persisting between sessions
- Empty days will not render an agenda list for the items that are within 7 days of them.
- No sign up form
- No date picker modal
- No time picker modal

### Bug Fixes
- Much needed UI updates
- Improved experience for mobile devices
- Fixed bug where user could not scroll to see full materials list
- Added headers to text input fields for user convenience
- Fixed "loading" icon bug from v0.1.0, now shows message "No events scheduled for today" when day is empty
- Added header (i.e. icon with yyyy-dd-mm) to weekly preview for user convenience
- Users can create accounts, no longer one master account controlling the app (was this way for initial demo purposes)
- Home route not rendering after authenticating user
- Event pop up modals not prefilled
- Event pop up modal rendering outside of EventProvider
- Filter and sort functionalities work with the click of a button instead of using a typed input field
- "Remember me" feature now works