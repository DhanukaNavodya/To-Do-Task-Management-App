import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '../firebase';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Img1 from '../images/img1.jpg';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';


function ToDoList() {
  const [toDoList, setToDoList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({ task: '', priority: '', description: '' });
  const [filterPriority, setFilterPriority] = useState('all');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Fetch tasks and logged-in user details
  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToDoList(todos);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Fetch logged-in user details from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser); // Set user state if logged-in user exists
    }

    fetchToDoList();
  }, []);

  // Log the user details after state is updated
  useEffect(() => {
    if (user) {
      console.log('Logged in user details:', user); // Log user details when user state is updated
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

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
          const taskDocRef = doc(db, 'todos', selectedTask.id);
          await updateDoc(taskDocRef, editValues);

          setToDoList((prevList) =>
            prevList.map((task) =>
              task.id === selectedTask.id ? { ...task, ...editValues } : task
            )
          );

          Swal.fire("Saved!", "The task has been updated successfully.", "success");
          setEditMode(false);
          setSelectedTask(null);
        } catch (error) {
          console.error("Error updating task: ", error);
          Swal.fire("Error", "There was an error updating the task. Please try again.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes not saved", "No changes were made to the task.", "info");
        setEditMode(false);
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
          await deleteDoc(doc(db, "todos", taskId));
          setToDoList((prevList) => prevList.filter((task) => task.id !== taskId));
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
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

  const filteredToDoList = toDoList.filter((task) => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  return (
    <div className="ToDoList p-6">
      <h1 className="text-center text-3xl text-green-500 mb-6">To-Do List</h1>
      
      {/* Display logged-in user details */}
      {user && (
        <div className="user-details mb-6 text-center">
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <div className="flex gap-20">
        {/* Priority Filter Dropdown */}
        <div className="flex gap-[660px]">
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

          {/* Add Task Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate('/add-task')}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            >
              <FaPlus className="inline mr-2" /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-grow">
          <ul className="list-none p-0">
            {filteredToDoList.map((task) => (
              <li
                key={task.id}
                onClick={() => {
                  setSelectedTask(task);
                  setEditValues(task);
                }}
                className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between cursor-pointer"
              >
                <p className="text-lg font-semibold text-gray-800">{task.task}</p>
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full text-white font-bold ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                >
                  {task.priority[0].toUpperCase()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Image Section */}
        <div className="w-1/3">
          <img src={Img1} alt="My Image" className="w-full h-auto rounded-lg" />
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editMode ? 'Edit Task' : 'Task Details'}
            </h2>

            {editMode ? (
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
              <div className="flex gap-60">
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>Task:</strong> {selectedTask.task}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Priority:</strong> {selectedTask.priority}
                  </p>
                  <p className="text-gray-700">
                    <strong>Description:</strong> {selectedTask.description}
                  </p>
                </div>
              </div>
            )}

            {/* Edit and Delete buttons */}
            <div className="flex justify-end mt-4 gap-3">
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => deleteTask(selectedTask.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={updateTask}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
              )}
            </div>

            {/* Close button */}
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoList;
