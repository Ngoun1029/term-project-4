import React, { useState, useEffect, useRef } from "react";
import { usePopup } from "../context/PopupContext";
import { userProfile } from "../../server/api";

export default function UpdatePf() {
    const [username, setUsername] = useState("");
    const [pf, setPf] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const { setActivePopup, activePopup, hidePopup } = usePopup();

    //up pf
    const handleUpdatePf = (e) => {
        e.preventDefault();

        setLoading(true);

        const param = {  }

    }

    //display information 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (activePopup === "updatePf") {
                    const data = await userProfile(token);
                    if (data?.data?.result?.user_details) {
                        const userDetails = data.data.result.user_details;
                        setUsername(userDetails.user_name || "");
                        setPf(userDetails.profile_picture || "");
                        console.log("Profile Picture:", userDetails.profile_picture);
                    }
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };

        fetchUserData();
    }, [activePopup, token]);

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

    //set to know which popup to display
    if (activePopup !== "updatePf") {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleUpdatePf}
                ref={contentRef}
                className="p-8 bg-gray-50 w-[500px] rounded-xl"
            >
                <div className="mb-6">
                    {pf && (
                        <div className="flex justify-center">
                            <img
                                src={pf}
                                alt="Profile"
                                className="w-32 h-32 object-cover mb-4 rounded-full"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={(e) =>
                            setPf(URL.createObjectURL(e.target.files[0]))
                        }
                        className="w-full p-3 border rounded-lg"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={hidePopup}
                        className="bg-lighter-blue text-black hover:bg-blue-hover py-2 px-8 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-black ms-3 text-white hover:text-[#ddd] py-2 px-8 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}