import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [activePopup, setActivePopup] = useState(null);

    //store unique id for each task
    const [currentTaskId, setCurrentTaskId] = useState(null);

    const showPopup = (popupType, taskId = null) => {
        setActivePopup(popupType);
        setCurrentTaskId(
            popupType === 'editTask' ? taskId : null ||
                popupType === 'deleteTask' ? taskId : null ||
                    popupType === 'updateTask' ? taskId : null ||
                        popupType === 'updatePf' ? taskId : null
        );
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
