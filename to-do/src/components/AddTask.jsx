import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase'; // Import Firestore functions
import { FaTrashAlt } from 'react-icons/fa'; // Import Trash Bin Icon
import Swal from 'sweetalert2'; // Import SweetAlert for better validation and user feedback

function ToDO() {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState(''); // State for task description
  const [priority, setPriority] = useState('low');   // State for task priority
  const [toDoList, setToDoList] = useState([]);

  // Load the to-do list from Firestore when the app loads
  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setToDoList(todos);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchToDoList();
  }, []);

  // Add a new to-do to Firestore
  const addToDo = async () => {
    if (!task.trim()) {
      Swal.fire('Empty Field Detected  ', 'Task name cannot be empty.', 'warning');
      return;
    }
    if (!description.trim()) {
      Swal.fire('Empty Field Detected', 'Task description cannot be empty.', 'warning');
      return;
    }

    try {
      // Add task, description, and priority to Firestore
      const docRef = await addDoc(collection(db, 'todos'), {
        task: task.trim(),
        description: description.trim(),
        priority: priority
      });
      setToDoList([...toDoList, { id: docRef.id, task, description, priority }]);
      setTask('');
      setDescription('');
      setPriority('low');
      Swal.fire('Success', 'Task added successfully!', 'success');
    } catch (error) {
      console.error('Error adding document:', error);
      Swal.fire('Error', 'Failed to add task. Please try again.', 'error');
    }
  };

  // Delete a to-do from Firestore
  const deleteToDo = async (index) => {
    const todoToDelete = toDoList[index];

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete the document using deleteDoc
          const docRef = doc(db, 'todos', todoToDelete.id);
          await deleteDoc(docRef);

          // Update the local state after deleting
          const updatedList = toDoList.filter((_, i) => i !== index);
          setToDoList(updatedList);

          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting document:', error);
          Swal.fire('Error', 'Failed to delete task. Please try again.', 'error');
        }
      }
    });
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
            <li
              key={todo.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex flex-col w-full">
                <p className="font-semibold text-lg text-gray-800 w-40">
                  <strong>Task:</strong> {todo.task}
                </p>
                <p
                  className={`
                    ${todo.priority === 'high' ? 'text-red-500' : ''} 
                    ${todo.priority === 'medium' ? 'text-yellow-500' : ''} 
                    ${todo.priority === 'low' ? 'text-green-500' : ''}
                  `}
                >
                  <strong>Priority:</strong> {todo.priority}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> <br />
                  {todo.description}
                </p>
              </div>

              {/* Trash bin icon for delete */}
              <button
                onClick={() => deleteToDo(index)}
                className="bg-transparent border-none text-red-500 text-2xl cursor-pointer w-10 mb-20"
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
