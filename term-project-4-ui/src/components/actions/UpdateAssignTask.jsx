import React, { useState, useEffect, useRef } from "react";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { usePopup } from "../context/PopupContext";
import { taskUpdateProgress } from "../../server/api";

export default function UpdateAssignTask() {
    const [progress, setProgress] = useState("");
    const [assignTask, setAssignTask] = useState({});
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

    const handleEditTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const TaskProgressUpdateParam = { taskId: currentTaskId, progress }
            console.log(currentTaskId, progress);
            

            const response = await taskUpdateProgress(TaskProgressUpdateParam, token);
            setAssignTask(response?.data?.result);
            console.log("Task updated successfully:", assignTask);

            hidePopup();

        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setLoading(false);
        }
    };

    if (activePopup !== "updateTask" || !currentTaskId) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
                ref={contentRef}
                className="p-8 bg-gray-50 w-[500px] rounded-xl"
            >
                <h1 className="text-xl">{assignTask?.title || 'Loading title..'}</h1>
                <div className="my-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center opacity-75">
                            <MdOutlineEmergencyShare />
                            <span className="ms-3">Progress</span>
                        </div>
                        <div>
                            <select
                                id="progress"
                                value={progress}
                                placeholder={assignTask.progress}
                                onChange={(e) => setProgress(e.target.value)}
                                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
                            >
                                <option value="" disabled>
                                    progress
                                </option>
                                <option value="pending">Pending</option>
                                <option value="complete">Finish</option>
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
                        type="button"
                        onClick={handleEditTask}
                        className=" bg-black ms-3 text-white hover:text-[#ddd] py-2 px-8 rounded-lg"
                    >
                        {loading ? 'Updating..' : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    );
}
