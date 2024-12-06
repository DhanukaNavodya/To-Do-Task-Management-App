import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs,deleteDoc,doc } from '../firebase'; // Import Firestore functions
import { FaTrashAlt } from 'react-icons/fa'; // Import Trash Bin Icon

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
      // Fetch the todos from Firestore
      const querySnapshot = await getDocs(collection(db, 'todos'));
      
      // Find the document ID of the task to delete
      querySnapshot.forEach(async (docSnapshot) => {
        if (docSnapshot.data().task === todoToDelete.task && docSnapshot.data().description === todoToDelete.description) {
          // Get the document reference using docSnapshot.id
          const docRef = doc(db, 'todos', docSnapshot.id);
          
          // Delete the document using deleteDoc
          await deleteDoc(docRef);
          
          // Update the local state after deleting
          const updatedList = toDoList.filter((_, i) => i !== index);
          setToDoList(updatedList);
        }
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };


  return (
    <div className="App max-w-2xl mx-auto p-6">
      <h1 className="text-center text-3xl text-green-500 mb-6">To-Do List</h1>
      
      {/* Task Input Section */}
      <div className="AddTask mb-6">
        {/* Input for task name */}
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md"
        />
        
        {/* Dropdown for task priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        {/* Textarea for task description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-3 h-24 mb-3 border border-gray-300 rounded-md"
        />

        {/* Button to add task */}
        <button
          onClick={addToDo}
          className="w-full p-3 bg-green-500 text-white rounded-md cursor-pointer"
        >
          Add Task
        </button>
      </div>

      {/* Task List Section */}
      <div className="ToDoList">
        {/* Render list of to-dos */}
        <ul className="list-none p-0">
          {toDoList.map((todo, index) => (
            <li key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex flex-col w-full">
              <p className="font-semibold text-lg text-gray-800"><strong>Task:</strong> {todo.task}</p>
              <p className="text-gray-600"><strong>Description:</strong> {todo.description}</p>
              <p className="text-gray-500"><strong>Priority:</strong> {todo.priority}</p>
            </div>
          
            {/* Trash bin icon for delete */}
            <button 
              onClick={() => deleteToDo(index)}
              className="bg-transparent border-none text-red-500 text-2xl cursor-pointer ml-40 mb-20"
            >
              <FaTrashAlt />
            </button>
          </li>
          
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDO;
