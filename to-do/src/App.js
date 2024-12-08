import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import React Router
import SignUp from './components/signup'
import Login from './components/login'
import AddTask from './components/AddTask'; // Import AddTask component
import ToDoList from './components/ToDoList'; // Import ToDoList component

function App() {
  const [toDoList, setToDoList] = useState([]);

  // Load the to-do list from Firestore when the app loads
 
  return (
    <Router>
      <div className="App">


        <Routes>
          {/* Define the route for Add Task page */}
          <Route
            path="/add-task"
            element={<AddTask setToDoList={setToDoList} />}
          />
          
          {/* Define the route for To-Do List page */}
          <Route
            path="/"
            element={<Login/>}
          /> 

          <Route
            path="/signup"
            element={<SignUp/>}
          /> 
          
          
          <Route path="/home" element={<ToDoList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
