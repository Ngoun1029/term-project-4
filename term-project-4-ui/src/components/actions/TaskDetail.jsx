import React, { useState, useEffect } from "react";
import { taskDetail } from "../../server/api";
import { TbCategoryPlus } from "react-icons/tb";
import { LuPencilLine } from "react-icons/lu";
import { MdOpenInNew, MdOutlineEmergencyShare } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

export default function TaskDetailModal({ taskId }) {
  const [categories, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [emergentLevel, setEmergentLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentTaskId, hidePopup } = usePopup();

  // Fetch the task details when the component mounts or taskId changes
  useEffect(() => {
    if (currentTaskId) {
      fetchTaskDetail(currentTaskId);
    }
  }, [currentTaskId]);

  const fetchTaskDetail = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await taskDetail(taskId, token);
      const taskData = response.data.result;

      setCategory(taskData.categories);
      setTitle(taskData.title);
      setDescription(taskData.description);
      setDeadline(taskData.deadline);
      setEmergentLevel(taskData.emergent_level);
    } catch (error) {
      console.log("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // Handle form submission here (e.g., create or update task)
  //   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-gray-50 w-[500px] rounded-xl"
      >
        <h1 className="text-xl">Task Details</h1>
        <div className="my-8">
          {/* Category Field */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <TbCategoryPlus />
              <span className="ms-3">Category</span>
            </div>
            <div>
              <select
                id="categories"
                value={categories}
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
                disabled // Make the select field read-only
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          {/* Title Field */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <LuPencilLine />
              <span className="ms-3">Title</span>
            </div>
            <div>
              <input
                id="title"
                value={title} // Display fetched title
                onChange={(e) => setTitle(e.target.value)}
                className="border border-slate-200 rounded-xl py-2 px-8"
                type="text"
                placeholder="Task title"
                readOnly // Make the input field read-only
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOpenInNew />
              <span className="ms-3">Description</span>
            </div>
            <div>
              <input
                type="text"
                id="description"
                value={description} // Display fetched description
                className="border border-slate-200 rounded-xl py-2 px-8"
                readOnly // Make the input field read-only
              />
            </div>
          </div>

          {/* Deadline Field */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <IoMdTime />
              <span className="ms-3">Deadline</span>
            </div>
            <div>
              <input
                type="date"
                id="deadline"
                value={deadline} // Display fetched deadline
                className="border border-slate-200 rounded-xl py-2 px-8"
                readOnly // Make the input field read-only
              />
            </div>
          </div>

          {/* Emergent Level Field */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center opacity-75">
              <MdOutlineEmergencyShare />
              <span className="ms-3">Emergent Level</span>
            </div>
            <div>
              <select
                id="emergent_level"
                value={emergentLevel} // Display fetched emergent level
                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
                disabled // Make the select field read-only
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={hidePopup}
            className="bg-lighter-blue text-black hover:bg-blue-hover py-2 px-8 rounded-lg"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
