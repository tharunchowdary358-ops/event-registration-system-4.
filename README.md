# Eventify — Event Registration System

A responsive frontend web development project for browsing events, registering attendees, and managing registrations.

## Features

- Browse a sample list of upcoming events
- Search by event name, category, description, or location
- Filter events by category
- Register using a form with basic validation
- Prevent duplicate registration for the same event in the current browser
- View and cancel registrations
- Persist registrations with browser `localStorage`
- Responsive layout for desktop, tablet, and mobile
- Accessible form labels and status messages

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

No package installation or build step is required. You can also use the **Live Server** extension in Visual Studio Code.

## Project structure

```text
event-registration-system/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How it works

1. Event information is stored in an array in `script.js`.
2. JavaScript renders event cards and applies search/category filters.
3. The registration form validates the attendee's name and email.
4. Registrations are saved in `localStorage`, so they remain after refreshing the same browser.
5. The registrations section lets users review or cancel their saved registrations.

## Important limitations

This is a **frontend demo project**. It does not use a server or database, so registrations are stored only in the browser where they were created. The displayed availability is sample data and is not reduced when someone registers. Do not enter sensitive or real attendee information into a public demo.

## Ideas for future improvements

- Add a backend with Java Spring Boot and a MySQL database
- Add login and administrator roles
- Store real event capacity and update remaining seats
- Add email confirmation
- Add automated tests

## GitHub upload

Create a new **public** repository on GitHub, for example `event-registration-system`. Upload these four project files to the repository root, or run:

```bash
git init
git add .
git commit -m "Build Eventify event registration website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/event-registration-system.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If you upload through GitHub's website, use **Add file → Upload files**, drag in the project files, and select **Commit changes**.
