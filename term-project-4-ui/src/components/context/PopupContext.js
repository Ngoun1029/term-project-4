import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [activePopup, setActivePopup] = useState(null);

    //store unique id for each task
    const [currentTaskId, setCurrentTaskId] = useState(null);

    // const showPopup = (popupType, taskId = null) => {
    //     setActivePopup(popupType);

    //     //if it's an edit form store a unique id get from task
    //     if (popupType === 'editTask' && taskId) {
    //         setCurrentTaskId(taskId);
    //     } else if (popupType === 'deleteTask' && taskId) {
    //         setCurrentTaskId(taskId);
    //     }
    // };

    const showPopup = (popupType, taskId = null) => {
        setActivePopup(popupType);
        setCurrentTaskId(popupType === 'editTask' || popupType === 'deleteTask' ? taskId : null);
    };


    const hidePopup = () => {
        setActivePopup(null);
        setCurrentTaskId(null);
    };

    return (
        <PopupContext.Provider value={{
            activePopup,
            setActivePopup,
            currentTaskId,
            showPopup,
            hidePopup
        }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
