// ToDoList.js
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase'; // Import Firestore functions

function ToDoList() {
  const [toDoList, setToDoList] = useState([]); // State to store fetched tasks

  // Fetch the to-do list from Firestore when the component mounts
  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos')); // Fetch 'todos' collection
        const todos = querySnapshot.docs.map(doc => doc.data().task); // Get data from each document
        setToDoList(todos); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchToDoList(); // Fetch data when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="ToDoList">
      <h1>To-Do List</h1>
      <ul>
        {toDoList.map((task, index) => (
          <li key={index}>{task}</li> // Display each to-do task
        ))}
      </ul>
    </div>
  );
}

export default ToDoList; // Export the ToDoList component
