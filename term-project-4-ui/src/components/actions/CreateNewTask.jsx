import React, { useState, useEffect, useRef } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from '../context/PopupContext';
import { MdOpenInNew } from "react-icons/md";
import { taskCreate } from '../../server/api';
import { TaskCreateParam } from '../../params/tasks-params/TaskCreateParam';

export default function CreateNewTask() {
  // Form state
  const [categories, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [emergent_level, setEmergent_level] = useState("");

  // Popup context
  const { setActivePopup, activePopup, hidePopup } = usePopup();

  // Ref for detecting clicks outside the popup
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

  // Only render if this popup is active
  if (activePopup !== "createTask") return null;

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare payload
      const param = { ...TaskCreateParam };
      param.categories = categories;
      param.title = title;
      param.description = description;
      param.deadline = deadline ? new Date(deadline).toISOString() : "";
      param.emergent_level = emergent_level;

      // Validate input
      if (
        !param.categories ||
        !param.title ||
        !param.description ||
        !param.deadline ||
        !param.emergent_level
      ) {
        console.error("Validation Error: All fields are required.", param);
        alert("All fields are required.");
        return;
      }

      // API call
      const response = await taskCreate(param, token);

      console.log("Task created successfully:", response);
      hidePopup();
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        ref={contentRef}
        className="p-8 bg-gray-50 w-[500px] rounded-xl"
      >
        <h1 className="text-xl">Create New Task</h1>
        <div className="my-8">
          {/* <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center opacity-75">
                            <TbCategoryPlus />
                            <span className="ms-3">Category</span>
                        </div>
                        <div>
                            <select
                                id="categories"
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
                    </div> */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <TbCategoryPlus />
              <span className="ms-3">Category</span>
            </div>
            <div>
              <select
                id="categories"
                value={categories} // Bind the value to the state
                onChange={(e) => setCategory(e.target.value)} // Update the state on change
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
                onChange={(e) => setEmergent_level(e.target.value)}
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
