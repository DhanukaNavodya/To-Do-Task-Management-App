# To-Do-Task-Management-App

To run react web application 
>>npm start

The technologies used in the provided code are:

### 1. React:
   - Purpose: React is a JavaScript library for building user interfaces. It allows the creation of reusable components and enables efficient updates of the user interface (UI) based on changes in application state.
   - Usage in the code: React is used to build the `Login` component, which includes handling state with `useState` and handling user input and form submission.

### 2. Firebase (Firestore):
   - Purpose: Firebase is a platform developed by Google for building mobile and web applications. Firestore is a flexible, scalable database for storing and syncing data in real-time.
   - Usage in the code: Firebase Firestore is used for storing and retrieving user data, such as checking if a user exists and validating the user's password. The Firestore functions like `getDocs` and `query` are used to interact with the database.

### 3. React Router:
   - Purpose: React Router is a library used to handle routing in React applications. It allows navigating between different pages/views without reloading the page.
   - Usage in the code: `useNavigate` from React Router is used to programmatically navigate to different pages, such as redirecting users to the home page after a successful login.

### 4. SweetAlert2:
   - Purpose: SweetAlert2 is a popular library for creating beautiful, responsive popups and alerts.
   - Usage in the code: SweetAlert2 is used to display success and error messages to the user during the login process, such as when the user successfully logs in or if there’s an error with the login attempt.

### 5. Tailwind CSS:
   - Purpose: Tailwind CSS is a utility-first CSS framework used for building custom designs without writing custom CSS. It provides a set of utility classes that can be used directly in HTML to style elements.
   - Usage in the code: Tailwind CSS is used for styling the login form and layout, including setting margins, padding, colors, and responsiveness. Classes like `flex`, `p-6`, `bg-white`, and `rounded-lg` are used to create a modern, responsive design.

### 6. JavaScript (ES6):
   - Purpose: JavaScript is a programming language that enables dynamic content on the web. ES6 (ECMAScript 2015) is the latest version of JavaScript, which introduces features like `const`, `let`, arrow functions, and `async/await` for better code readability and performance.
   - Usage in the code: ES6 features such as `const`, `let`, and `async/await` are used for handling state, managing side effects (like API calls), and improving code structure.

### 7. CSS Flexbox:
   - Purpose: Flexbox is a layout model in CSS that allows easy alignment and distribution of space among items in a container, even when their size is unknown or dynamic.
   - Usage in the code: Flexbox is used to create a responsive layout where the login form and image can be displayed next to each other on larger screens and stacked on smaller screens.

### 8. Browser Storage (localStorage):
   - Purpose: localStorage provides a way to store data persistently in the browser across page reloads. It’s useful for storing session data, user preferences, or login states.
   - Usage in the code: The user's details are stored in `localStorage` after a successful login, allowing them to remain logged in even after page refreshes.

These technologies work together to create a seamless, modern, and responsive login feature with real-time database interactions, a smooth user experience, and responsive design.
