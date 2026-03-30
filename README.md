# Animal Crossing System Dashboard — Employee Portal

## Overview

This project simulates an Employee Portal for a company themed on Animal Crossing. Users can log in and view profile cards based on their role (Admin or Employee).

- **Employees** can see their own card and the Admin cards.
- **Admins** can see everyone — and even dispose of employees if they feel like it, unlike in Animal Crossing.

### Features

**Login System**
- Users enter a username and password to access the system
- Inputs are validated using Regex to prevent invalid characters and protect against SQL injection attacks
- The system checks credentials against a live list of active users (so disposed employees can't log in)
- A small loading spinner shows while the login processes

**Profile Cards**
Each user card includes:
- Profile picture
- Current role (Admin / Employee)
- Full name, email, hobbies, and birthday
- Admin cards appear in **purple** and Employee cards appear in **green** to tell them apart
- The logged-in user's card gets a `[Current]` badge

**User Roles**
- Admins can see all employee profiles, delete employees, and view the Disposed Villagers list
- Employees can only see the Admin cards and their own profile card
- Admins cannot delete themselves or other Admins — only Employees

**Disposed Villagers**
- When an Admin deletes an Employee, the card fades out with an animation and moves to the Disposed section
- Disposed cards show the employee's profile picture, full name, and disposed status
- Deleted users are removed from `activeUsers` so they can no longer log in, but the original `baseUsers` list stays untouched

**Logout**
- Clicking logout triggers a fade-out animation, clears the current user session (but doesn't reset the active list), hides all profile cards, and returns to the main login screen

---

## Setup & Running the Application

Open `index.html` in a browser - **Google Chrome is recommended**.

### Credentials

All usernames and passwords follow the same pattern for testing purposes.

**Employee Accounts**

| Name | Username | Password |
|---|---|---|
| Tom Nook | user1 | user1 |
| Isabelle ShihTzu | user2 | user2 |
| K.K. Slider | user3 | user3 |
| Celeste Stargazer | user4 | user4 |
| Resetti Mole | user5 | user5 |
| Mabel Able | user6 | user6 |
| Sable Able | user7 | user7 |
| Label Able | user8 | user8 |
| Brewster Roost | user9 | user9 |
| Kapp'n Sailor | user10 | user10 |
| Pascal Otterson | user11 | user11 |
| Leif Gardener | user12 | user12 |

**Admin Accounts**

| Name | Username | Password |
|---|---|---|
| Timmy Nook | user13 | user13 |
| Tommy Nook | user14 | user14 |
| Sofia Mtz | user15 | user15 |

### Login Steps

1. Open `index.html` in a browser (preferably Google Chrome)
2. Click the **Login** button on the main screen, underneath the Animal Crossing logo
3. Enter a username and password from the credentials listed above
4. Click **Confirm** — a spinner will appear briefly, then the profile cards will load
5. If logged in as an **Admin**, the Employee page and Disposed Villagers tabs will appear in the navbar. If logged in as an **Employee**, only the Logout button will appear.
6. To see disposed cards, click the **[Delete Employee]** button on a card, then navigate to **Disposed Villagers** in the navbar
7. Click **Logout** to end your session and return to the main screen
