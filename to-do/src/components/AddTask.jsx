import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs } from '../firebase'; // Import Firestore functions

function ToDO() {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState(''); // State for task description
  const [priority, setPriority] = useState('low');   // State for task priority
  const [toDoList, setToDoList] = useState([]);

  // Load the to-do list from Firestore when the app loads
  useEffect(() => {
    const fetchToDoList = async () => {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todos = querySnapshot.docs.map(doc => doc.data());
      setToDoList(todos);
    };
    fetchToDoList();
  }, []);

  // Add a new to-do to Firestore
  const addToDo = async () => {
    if (task.trim() && description.trim()) {
      try {
        // Add task, description, and priority to Firestore
        await addDoc(collection(db, 'todos'), {
          task: task,
          description: description,
          priority: priority
        });
        setToDoList([...toDoList, { task, description, priority }]);
        setTask('');
        setDescription('');
        setPriority('low');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // Delete a to-do from Firestore
  const deleteToDo = async (index) => {
    const todoToDelete = toDoList[index];
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      querySnapshot.forEach(doc => {
        if (doc.data().task === todoToDelete.task) {
          doc.ref.delete();  // Delete the document based on task match
        }
      });
      const updatedList = toDoList.filter((_, i) => i !== index);
      setToDoList(updatedList);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      
      {/* Task Input Section */}
      <div className="AddTask">
        {/* Input for task name */}
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        
        {/* Textarea for task description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />

        {/* Dropdown for task priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Button to add task */}
        <button onClick={addToDo}>Add Task</button>
      </div>

      {/* Task List Section */}
      <div className="ToDoList">
        {/* Render list of to-dos */}
        <ul>
          {toDoList.map((todo, index) => (
            <li key={index}>
              <p><strong>Task:</strong> {todo.task}</p>
              <p><strong>Description:</strong> {todo.description}</p>
              <p><strong>Priority:</strong> {todo.priority}</p>
              <button onClick={() => deleteToDo(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDO;
