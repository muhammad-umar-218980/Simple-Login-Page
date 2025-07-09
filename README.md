# Simple Login Page

A simple Node.js and Express web application for user registration and login, with a modern UI using Tailwind CSS.

## Features

- User registration and login forms
- Email existence check on login
- Error messages for invalid credentials and duplicate emails
- User data stored in a plain text file (`users.txt`)
- Clean, responsive UI with Tailwind CSS and Font Awesome

## Folder Structure

```
├── public/
│   ├── login.html
│   └── register.html
├── server.js
├── users.txt
├── package.json
└── package-lock.json
```

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd "Simple Login Page"
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```
   The server will run at [http://localhost:3000](http://localhost:3000).

4. **Open in your browser:**
   - Visit `/register.html` to create a new account.
   - Visit `/login.html` to log in.

## Notes

- All user data is stored in `users.txt` in plain text (for demo/learning only; not secure for production).
- The UI uses Tailwind CSS CDN and Font Awesome for icons.

