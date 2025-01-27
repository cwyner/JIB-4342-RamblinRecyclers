# Upcycle Build Overview
The Upcycle Build application aims to assist those who work in the reuse industry by managing their work all in one place. The app has 3 main functionalities:
1) An activity calendar for deconstruction workers
2) A receiving section for reuse center employees to manage their inventory
3) An upcycling section that tracks the amount of materials diverted from the waste stream to support funding efforts for reuse centers

Each of these parts makes up an app that provides a quality-of-life service to all of those working in this industry. It enables them to get work done with increased efficiency, which is critical for the fast-paced environment they work in.

# Release Notes
## v0.1.0
### Features
- Registration Screen
- Login Screen
- Account Roles

### Bug Fixes
- Users can create accounts, no longer one master account controlling the app (was this way for initial demo purposes)

### Known Issues
- "Loading" icon spins on Calendar screen when there are no events for that day
- No Single Sign-On (SSO) functionality yet


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