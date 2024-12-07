import React, { useState, useEffect } from "react";
import { historyDetail, historyData } from "../../server/api";

export default function FetchHistory() {
    const [historyList, setHistoryList] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const range = 8;

    // Fetch paginated history data
    const fetchHistoryData = async (page) => {
        setLoading(true);
        setError("");

        try {
            const params = { page, range };
            const data = await historyData(params, token);

            if (data && data.status === "success") {
                const result = data.data?.result || {};

                console.log(result);
                
                setHistoryList(result.data || []);
                setCurrentPage(result.current_page || 1);
                setTotalPages(Math.ceil(result.total / result.per_page) || 0);
            } else {
                throw new Error("Invalid API response");
            }
        } catch (err) {
            console.error("Error fetching history data:", err);
            setError("Failed to fetch history data.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch details for a specific history item
    const fetchHistoryDetail = async (id) => {
        setLoading(true);
        setError("");
        try {
            const data = await historyDetail(id, token);
            if (data) {
                setSelectedHistory(data);
            } else {
                throw new Error("History details not found");
            }
        } catch (err) {
            console.error("Error fetching history detail:", err);
            setError("Failed to fetch history details.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the component mounts or page changes
    useEffect(() => {
        fetchHistoryData(currentPage);
    }, [currentPage]);

    // Handle pagination
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        if (direction === "prev" && currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="pe-8 pt-24">
            <h1 className="text-xl font-bold mb-4">History Data</h1>

            {/* Loading and error messages */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* History list */}
            <ul>
                {historyList.map((history) => (
                    <li
                        key={history.id}
                        className="border p-4 mb-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => fetchHistoryDetail(history.id)} // Fetch details on click
                    >
                        <h2 className="font-semibold">{history.title}</h2>
                        <p>{history.description}</p>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* History details */}
            {selectedHistory && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-lg font-bold">History Details</h2>
                    <p><strong>ID:</strong> {selectedHistory.id}</p>
                    <p><strong>Title:</strong> {selectedHistory.title}</p>
                    <p><strong>Description:</strong> {selectedHistory.description}</p>
                    {/* Include additional fields if available */}
                </div>
            )}
        </div>
    );
}
