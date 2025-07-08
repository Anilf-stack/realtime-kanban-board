#  Collaborative Real-Time Kanban Board

A web-based real-time collaborative task board where multiple users can register, manage tasks, and view updates live—similar to a minimal Trello board with smart logic features.

---

##  Features

- User registration & login  
- Create, edit, delete tasks  
- Drag & drop across columns (Todo, In Progress, Done)  
- Smart Assign to balance workload  
- Live updates via Socket.IO  
- Activity log for every task operation  
- Conflict detection & resolution  
- Fully responsive (mobile-friendly)  
- Smooth animations for UX enhancement

---

## Tech Stack

### Frontend
- React.js (Vite)
- Context API for auth
- Socket.IO client
- Custom CSS (no Bootstrap or Tailwind)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO server
- JWT Authentication
- Bcrypt for password hashing

---

##  Setup & Installation

>  Make sure MongoDB is running locally or remotely.

###  Clone the repo
```bash
git clone https://github.com/Anilf-stack/realtime-kanban-board.git
cd realtime-kanban-board

## Usage Guide

1. Register as a new user.
2. Login and enter the Kanban board.
3. Add tasks via the form at the top.
4. Drag & drop tasks across columns.
5. Use **Smart Assign** to auto-distribute tasks.
6. View real-time logs in the sidebar.
7. Click to edit or to delete a task.

## Folder Structure

realtime-kanban-board/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── socket.js
│ └── index.js
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── main.jsx

## 📘 Logic Document
- [Logic_Document.pdf](https://drive.google.com/file/d/1MihSoYUFwzveUjmdlGqH3niIvs1AYYUj/view?usp=sharing)
