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
          <h1 className='text-3xl font-medium'>Task History</h1>
          {loading ? (
            <p className='mt-4'>Loading History...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="max-w-[98%]">
              <table className="table-auto w-full mt-6">
                <thead>
                  <tr className="text-left">
                    <th className='pb-6 text-lg'>Title</th>
                    <th className='pb-6 text-lg'>Created Date</th>
                    <th className='pb-6 text-lg'>Deadline</th>
                    <th className='pb-6 text-lg'>Emergent Level</th>
                    <th className='pb-6 text-lg'>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {historys.length > 0 ? (
                    historys.map((history, index) => (
                      <tr key={index} >
                        <td className='pb-4'>{history.title}</td>
                        <td className='pb-4'>{new Date(history.created_at).toLocaleString()}</td>
                        <td className='pb-4'>{new Date(history.deadline).toLocaleString()}</td>
                        <td className='pb-4'>{history.emergent_level}</td>
                        <td className='pb-4'>
                          <span className='rouned-full p-2 bg-ligher-purple text-purple-800' style={{borderRadius: '12px'}}>{history.progress}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center mt-24">No history available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="pagination mt-16 flex justify-between max-w-[95%]">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn-prev rounded-xl bg-lighter-blue text-blue-800 hover:bg-blue-hover py-2 px-8"
            >
              &laquo; Previous
            </button>
            <span className="mx-2">Page {pagination.currentPage} of {pagination.lastPage}</span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="btn-next rounded-xl bg-lighter-blue text-blue-800 hover:bg-blue-hover py-2 px-8"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
