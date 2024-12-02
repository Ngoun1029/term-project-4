import React, { useState, useEffect, useRef } from "react";
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare, MdOpenInNew } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from "../context/PopupContext";
import { taskDetail, taskUpdate } from "../../server/api";

export default function EditTask() {
  const [categories, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [emergent_level, setEmergentLevel] = useState("");
  const [progress, setProgress] = useState("");

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
    }
  }, [currentTaskId, activePopup]);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskDetail({ task_id: currentTaskId }, token);
      const task = response?.data;
      if (task) {
        setCategory(task.categories || "");
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
        setEmergentLevel(task.emergent_level || "");
        setProgress(task.progress || "");
      }
    } catch (error) {
      console.error("Error fetching task details: ", error);
    }
  };

  const handleSubmit = async (e) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        ref={contentRef}
        onSubmit={handleSubmit}
        className="p-8 bg-gray-50 w-[500px] rounded-xl"
      >
        <h1 className="text-xl">Edit Task {currentTaskId}</h1>
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
                placeholder="Task title"
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
                onChange={(e) => setEmergentLevel(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
              >
                <option value="" disabled>
                  Emergent Level
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
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
            type="submit"
            className="ms-3 bg-black text-white hover:text-[#ddd] py-2 px-8 rounded-lg"
          >
             {loading ? 'Saving..' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
