import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import Navbar from '../components/Navbar';
import { historyData } from '../server/api';
import { HistoryDataParam } from '../params/history/HistoryDataParam';

export default function History() {
  const [historys, setHistory] = useState([]);  // Store history data
  const [loading, setLoading] = useState(true);  // Store loading state
  const [error, setError] = useState(null);  // Store error state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  // Fetch history data from API
  const fetchHistoryData = async (page = 1) => {
    const param = { ...HistoryDataParam };  // Create a copy to avoid mutation
    param.page = page;
    param.range = 10;
    const token = localStorage.getItem('token');
    
    try {
      setLoading(true);
      const response = await historyData(param, token);
      if (response && response.data && response.data.result && response.data.result.data) {
        setHistory(response.data.result.data);  // Set history data
        setPagination({
          currentPage: response.data.result.current_page,
          lastPage: response.data.result.last_page,
          total: response.data.result.total
        });
      } else {
        setError('No data available');  // Set error if no data
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to fetch history');  // Set error if the request fails
    }
    setLoading(false);  // Update loading state
  };

  // Fetch data on component mount or when page changes
  useEffect(() => {
    fetchHistoryData(pagination.currentPage);
  }, [pagination.currentPage]);  // Fetch on page change

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  return (
    <div>
      <SideBar />
      <div className="ms-32">
        <Navbar />
        <div className='pt-24'>
          <h1 className='text-xl'>Task History</h1>
          {loading ? (
            <p className='mt-4'>Loading History...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {historys.length > 0 ? (
                historys.map((history, index) => (
                  <li key={index}>
                    <p>{history.title}</p>
                    <small>{new Date(history.created_at).toLocaleString()}</small>
                  </li>
                ))
              ) : (
                <p className='text-center mt-24'>No history available.</p>
              )}
            </ul>
          )}
          
          {/* Pagination Controls */}
          <div className="pagination mt-4">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)} 
              disabled={pagination.currentPage === 1}
              className="btn-prev"
            >
              &laquo; Previous
            </button>
            <span className="mx-2">Page {pagination.currentPage} of {pagination.lastPage}</span>
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)} 
              disabled={pagination.currentPage === pagination.lastPage}
              className="btn-next"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
