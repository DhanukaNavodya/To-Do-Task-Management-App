import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '../firebase'; // Import Firestore functions
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Import icons for edit, delete, and add
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import Img1 from '../images/img1.jpg'
import Swal from 'sweetalert2'

function ToDoList() {
  const [toDoList, setToDoList] = useState([]); // State to store fetched tasks
  const [selectedTask, setSelectedTask] = useState(null); // State to track selected task details
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [editValues, setEditValues] = useState({ task: '', priority: '', description: '' }); // State to hold editable task values
  const [filterPriority, setFilterPriority] = useState('all'); // State to store selected priority for filtering
  const navigate = useNavigate(); // Hook to navigate to different pages

  // Fetch the to-do list from Firestore when the component mounts
  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos')); // Fetch 'todos' collection
        const todos = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Store the document ID for reference
          ...doc.data(),
        })); // Get data from each document
        setToDoList(todos); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchToDoList(); // Fetch data when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle input change for editable fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // Update task details in Firestore
  const updateTask = async () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const taskDocRef = doc(db, 'todos', selectedTask.id); // Get Firestore document reference
          await updateDoc(taskDocRef, editValues); // Update Firestore document
  
          // Update the local state with the updated task
          setToDoList((prevList) =>
            prevList.map((task) =>
              task.id === selectedTask.id ? { ...task, ...editValues } : task
            )
          );
  
          Swal.fire("Saved!", "The task has been updated successfully.", "success");
          setEditMode(false); // Exit edit mode
          setSelectedTask(null); // Close modal
        } catch (error) {
          console.error("Error updating task: ", error);
          Swal.fire("Error", "There was an error updating the task. Please try again.", "error");
        }
      } else if (result.isDenied) {

        Swal.fire("Changes not saved", "No changes were made to the task.", "info");
        setEditMode(false)
      }
    });
  };
  

  const deleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete task from Firestore
          await deleteDoc(doc(db, "todos", taskId));
          // Remove task from state
          setToDoList((prevList) => prevList.filter((task) => task.id !== taskId));
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.error("Error deleting task: ", error);
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the task. Please try again.",
            icon: "error"
          });
        }
      }
    });
  };
  

  // Filter and sort tasks based on selected priority
  const filteredToDoList = toDoList.filter((task) => {
    if (filterPriority === 'all') return true; // Show all tasks
    return task.priority === filterPriority; // Filter by priority
  });

  // Swal.fire({
  //   title: "Do you want to save the changes?",
  //   showDenyButton: true,
  //   showCancelButton: true,
  //   confirmButtonText: "Save",
  //   denyButtonText: `Don't save`
  // }).then((result) => {
  //   /* Read more about isConfirmed, isDenied below */
  //   if (result.isConfirmed) {
  //     saveTask(updateTask)
  //     Swal.fire("Saved!", "", "success");
  //   } else if (result.isDenied) {
  //     Swal.fire("Changes are not saved", "", "info");
  //   }
  // });
  

  return (
    <div className="ToDoList max-w-2xl mx-auto p-6">
      <h1 className="text-center text-3xl text-green-500 mb-6">To-Do List</h1>

      {/* Priority Filter Dropdown */}
      <center>
      <div className="mb-4">
        <label htmlFor="priorityFilter" className="text-gray-700 mr-2">Filter by Priority:</label>
        <select
          id="priorityFilter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      </center>
      <img src={Img1} alt="My Image" />

      {/* Add Task Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => navigate('/add-task')} // Navigate to Add Task page
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          <FaPlus className="inline mr-2" /> Add Task
        </button>
      </div>

      <ul className="list-none p-0">
        {filteredToDoList.map((task) => (
          <li
            key={task.id}
            onClick={() => {
              setSelectedTask(task);
              setEditValues(task); // Load task details for editing
            }}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between cursor-pointer"
          >
            {/* Task Name */}
            <p className="text-lg font-semibold text-gray-800">{task.task}</p>

            {/* Priority Circle */}
            <div
              className={`h-8 w-8 flex items-center justify-center rounded-full text-white font-bold ${
                task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
            >
              {task.priority[0].toUpperCase()} {/* Display first letter of priority */}
            </div>
          </li>
        ))}
      </ul>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editMode ? 'Edit Task' : 'Task Details'}
            </h2>

            {editMode ? (
              // Edit form
              <div>
                <input
                  name="task"
                  value={editValues.task}
                  onChange={handleEditChange}
                  placeholder="Task Name"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                />
                <select
                  name="priority"
                  value={editValues.priority}
                  onChange={handleEditChange}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <textarea
                  name="description"
                  value={editValues.description}
                  onChange={handleEditChange}
                  placeholder="Task Description"
                  className="w-full p-3 h-24 mb-3 border border-gray-300 rounded-md"
                />
              </div>
            ) : (
              // Display task details
              <div className='flex gap-60'>
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>Task:</strong> {selectedTask.task}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Priority:</strong> {selectedTask.priority}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Description:</strong> {selectedTask.description}
                  </p>
                </div>
                {/* Action Buttons */}
                <div className='h-35'>
                  <FaEdit
                    className="text-blue-500 size-6 cursor-pointer"
                    onClick={() => setEditMode(true)} // Enable edit mode
                  />
                  <FaTrash
                    className="text-red-500 size-6 mt-11 cursor-pointer"
                    onClick={() => {
                      deleteTask(selectedTask.id); // Delete the selected task
                      setSelectedTask(null); // Close modal after deletion
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              {editMode ? (
                // Save and Cancel buttons for edit mode
                <>
                  <button
                    onClick={updateTask}
                    className="w-1/2 bg-green-500 text-white p-3 rounded-md cursor-pointer mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="w-1/2 bg-gray-500 text-white p-3 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                // Close button for view mode
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full bg-red-500 text-white p-3 rounded-md cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ToDoList;
