# Mini Project App

we making simple full-stack project built with **React + Node.js + Express** for learning Secure file Sharing System . 

It includes authentication (login/register), protected routes, and cookie-based sessions.

---
## What a Secure File Sharing System Does ?

- Files are uploaded by a user (owner).

 - Only the intended recipient (identified by email / unique token) or the encripted tokens shares by URL

- Unauthorized users cannot access the file, even if they get the URL.

- Link expires after time (optional for extra security).


---
 ## Where It’s Used in Real Life

- WeTransfer → send file to specific email, link expires.

- Google Drive (restricted share) → only added users can access.

- Dropbox → password-protected file links.

- Optional encryption → Encrypt files on upload and decrypt only for the intended recipient.

## 🚀 Features
- User Registration & Login
- Session handling with cookies
- Logout functionality
- Secure backend API with Express
- Frontend built using React + Vite

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: JSON file 
- **Authentication**: Cookie-based sessions

---

## 📦 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/manish7576/mini-project-app.git
