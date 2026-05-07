# Video Demo Script: Team Task Manager

**Target Length:** 2.5 - 3 Minutes

## 0:00 - 0:30 | Introduction & Authentication
*(Screen: Show the Signup / Login Screen)*
**Speaker:** 
"Hello! Welcome to the Team Task Manager. This is a full-stack MERN application designed with a premium, SaaS-style UI to manage projects and track team progress efficiently."

*(Action: Fill out the Signup form and create an 'Admin' account. Then log in.)*
**Speaker:** 
"Security is built-in from the start. All passwords are hashed using bcrypt, and authentication is handled securely via JWT. As you can see, the UI transitions are powered by Framer Motion, giving the application a highly responsive, modern feel."

## 0:30 - 1:15 | Dashboard & Data Visualization
*(Screen: Dashboard page rendering the KPI cards and Recharts Pie Chart)*
**Speaker:** 
"Upon logging in, we are greeted by the Dashboard. Because I logged in as an Admin, I have full visibility into the platform's global metrics."

*(Action: Hover over the KPI cards and the Pie Chart)*
**Speaker:** 
"We built dynamic KPI cards that track total tasks, completed tasks, and automatically calculate overdue tasks using our backend logic where the due date is strictly prior to today and the status is not 'Done'. The Recharts integration provides an interactive visual breakdown of our task distribution."

## 1:15 - 2:00 | Project Management (Admin Role)
*(Screen: Navigate to Projects page)*
**Speaker:** 
"Let's look at Project Management. Because of our strict Role-Based Access Control middleware, Admins have the authority to create projects."

*(Action: Click 'New Project', create a quick project. Click into the Project Details page)*
**Speaker:** 
"We can create a new initiative, view the total project list, and click into a specific project to view its details. On the Project Details page, Admins can easily add existing members to the project team and manage all tasks tied directly to this project via MongoDB relationships."

## 2:00 - 2:45 | Task Management & Member View
*(Screen: Navigate to Tasks page, create a Task)*
**Speaker:** 
"Let's assign a task. I can create a new task, set its priority, define a strict due date, and assign it to a specific user."

*(Action: Log out. Log back in with a 'Member' role account)*
**Speaker:** 
"To demonstrate our Role-Based Access Control, I've logged back in as a standard Member. Notice how the 'Create Project' and 'Create Task' buttons are completely hidden."

*(Action: Navigate to Tasks page. Use the Status dropdown to filter tasks. Change a task status to 'Done')*
**Speaker:** 
"Members are restricted to viewing *only* the tasks assigned directly to them. They cannot delete tasks, but they can update the status to track their progress. As I mark this task as 'Done', the backend instantly updates the database, which will immediately reflect back on the Admin's global dashboard."

## 2:45 - 3:00 | Conclusion
*(Screen: Show the GitHub repository or Railway deployment URL)*
**Speaker:** 
"The entire application is completely responsive, strictly validates all inputs using Mongoose enums and schemas, and is fully deployed on Railway. Thank you for watching!"
