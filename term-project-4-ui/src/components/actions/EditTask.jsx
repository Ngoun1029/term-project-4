import React, { useState, useEffect, useRef } from "react";
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare, MdOpenInNew } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from "../context/PopupContext";
import { taskDelete, taskDetail, taskUpdate } from "../../server/api";
import { MdOutlineAttachEmail } from "react-icons/md";

export default function EditTask() {
  const [categories, setCategory] = useState("loading..");
  const [title, setTitle] = useState("loading..");
  const [description, setDescription] = useState("loading..");
  const [deadline, setDeadline] = useState("loading..");
  const [emergent_level, setEmergentLevel] = useState("loading..");
  const [progress, setProgress] = useState("");
  const [email, setEmail] = useState("");
  const [task, setTask] = useState('');

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Popup context
  const { setActivePopup, currentTaskId, activePopup, hidePopup } = usePopup();

  // Ref to close the popup when clicking outside
  const contentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActivePopup]);

  // Fetch task details when the popup is opened
  useEffect(() => {
    if (currentTaskId && activePopup === "editTask") {
      fetchTaskDetails();
    } else {
      resetFormFields();
    }
  }, [currentTaskId, activePopup]);

  const fetchTaskDetails = async () => {
    try {

      const response = await taskDetail(currentTaskId, token);
      const task = response?.data?.result;

      setTask(task);
      console.log('task popup', task);

      if (task) {
        setCategory(task.categories || "");
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
        setEmergentLevel(task.emergent_level || "");
        setProgress(task.progress || "");
        setEmail(task.email || "");
      }
    } catch (error) {
      console.error("Error fetching task details: ", error);
    }
  };

  //clear form
  const resetFormFields = () => {
    setCategory("Loading...");
    setTitle("Loading...");
    setDescription("Loading...");
    setDeadline("Loading...");
    setEmergentLevel("Loading...");
    setProgress("");
    setEmail("");
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const param = {
        task_id: currentTaskId,
        categories,
        title,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : "",
        emergent_level,
        progress,
        email
      };

      // Validate fields
      if (!categories || !title || !description || !deadline || !emergent_level) {
        alert("All fields are required.");
        return;
      }

      const response = await taskUpdate(param, token);
      console.log("Task updated successfully:", response);
      hidePopup();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  if (activePopup !== "editTask" || !currentTaskId) {
    return null;
  }

  //delete task 
  const handleDeleteTask = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {
      const response = await taskDelete(currentTaskId, token);

      if (response) {
        console.log("Task updated successfully:", response);
        hidePopup();
      }
    } catch (error) {
      console.error("Error deleting task", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        ref={contentRef}
        className="p-8 bg-gray-50 w-[500px] rounded-xl"
      >
        <h1 className="text-xl">Task Details: {task.title}</h1>
        <div className="my-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <TbCategoryPlus />
              <span className="ms-3">Category</span>
            </div>
            <div>
              <select
                id="categories"
                value={categories}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
              >
                <option value="" disabled>
                  Task Type
                </option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <LuPencilLine />
              <span className="ms-3">Title</span>
            </div>
            <div>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8"
                type="text"
              />
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOpenInNew />
              <span className="ms-3">Description</span>
            </div>
            <div>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8"
              />
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <IoMdTime />
              <span className="ms-3">Deadline</span>
            </div>
            <div>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder={task.deadline}
                className="border border-slate-200 rounded-xl py-2 px-8"
              />
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOutlineEmergencyShare />
              <span className="ms-3">Emergent Level</span>
            </div>
            <div>
              <select
                id="emergent_level"
                value={emergent_level}
                placeholder={task.emergent_level}
                onChange={(e) => setEmergentLevel(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
              >
                <option value="" disabled>
                  Emergent Level
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOutlineEmergencyShare />
              <span className="ms-3">Progress</span>
            </div>
            <div>
              <select
                id="progress"
                value={progress}
                placeholder={task.progress}
                onChange={(e) => setProgress(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
              >
                <option value="" disabled>
                  progress
                </option>
                <option value="pending">Pending</option>
                <option value="finish">Finish</option>
              </select>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOutlineAttachEmail />
              <span className="ms-3">User Email</span>
            </div>
            <div>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={hidePopup}
            className="bg-lighter-blue text-black hover:bg-blue-hover py-2 px-8 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteTask}
            className="bg-lighter-blue mx-3 text-black hover:bg-blue-hover py-2 px-8 rounded-lg"
          >
            {loading ? 'Delete..' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={handleEditTask}
            className=" bg-black text-white hover:text-[#ddd] py-2 px-8 rounded-lg"
          >
            {loading ? 'Editing..' : 'Edit'}
          </button>
        </div>
      </form>
    </div>
  );
}