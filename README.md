# Upcycle Build Overview
The Upcycle Build application aims to assist those who work in the reuse industry by managing their work all in one place. The app has 3 main functionalities:
1) An activity calendar for deconstruction workers
2) A receiving section for reuse center employees to manage their inventory
3) An upcycling section that tracks the amount of materials diverted from the waste stream to support funding efforts for reuse centers

Each of these parts makes up an app that provides a quality-of-life service to all of those working in this industry. It enables them to get work done with increased efficiency, which is critical for the fast-paced environment they work in.

# Release Notes
## v0.3.0
### Features
- Material donations can be received into a centralized database
- Ability to log multiple items in the same donation
- App view of all logged donations
- Ability to edit/comment on existing donations
- Donors are emailed with a receipt of their donation
- Continuous UI updates

### Bug Fixes
- Fixed bug where user could not scroll to see full materials list
- Added headers to text input fields for user convenience

### Known Issues
- Email receipts are currently being sent from a dev's personal email; working on getting access to an official Upcycle Build address
- Also working on formatting email receipts by PDF, giving them a more professional feel
- Materials screen still needs some UI updates
- Logout button in the top right of the screen on materials and receiving tab; should be hamburger menu here instead

## v0.2.0
### Features
- Next and Previous Week buttons for calendar navigation
- Weekly Preview
- Date and Time Picker modals
- Ability to check tasks off
- Map view

### Bug Fixes
- Fixed "loading" icon bug from v0.1.0, now shows message "No events scheduled for today" when day is empty
- Added header (i.e. icon with yyyy-dd-mm) to weekly preview for user convenience

### Known Issues
- "Remember me" on login does not work (denies login)
- Clicking between days will sometimes show an arbitrary range of days on the preview, not always the 7 days in the week

## v0.1.0
### Features
- Registration Screen
- Login Screen
- Account Roles
- Settings Page
- Teams
- Supports use by organizations

### Bug Fixes
- Users can create accounts, no longer one master account controlling the app (was this way for initial demo purposes)

### Known Issues
- "Loading" icon spins on Calendar screen when there are no events for that day
- No Single Sign-On (SSO) functionality yet
- Calendar brings user to wrong day upon launch


## v0.0.0
### Features
- Activity Calendar
- Authentication
- Firestore Layer

### Bug Fixes
- Home route not rendering after authenticating user
- Event pop up modals not prefilled
- Event pop up modal rendering outside of EventProvider

### Known Issues
- User authenticated state not persisting between sessions
- Empty days will not render an agenda list for the items that are within 7 days of them.
- No sign up form
- No date picker modal
- No time picker modal
