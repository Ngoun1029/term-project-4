import React, { useState, useEffect } from 'react';
import echo from '../server/echo'; // Laravel Echo instance
import { notificationData } from '../server/api'; // API for notifications
import SideBar from '../components/SideBar';
import Navbar from '../components/Navbar';

const TaskNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationData({ page: 1, range: 10 }, token);
        const fetchedNotifications = response.data.result.data;

        setNotifications(fetchedNotifications);

        if (fetchedNotifications.length > 0) {
          setUserId(fetchedNotifications[0].user_id);
        } else {
          console.warn("No notifications found.");
        }

        console.log('noti: ', notifications);
        console.log('userID: ', userId);

      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("There was an error fetching notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (!userId) return;

    const channel = echo.private(`user.${userId}`);

    channel.listen('.TaskNotification', (event) => {
      setNotifications((prevNotifications) => [event, ...prevNotifications]);
    });

    return () => {
      channel.stopListening('.TaskNotification');
    };
  }, [userId]);

  return (
    <div>
      <SideBar />
      <div className="ms-32">
        <Navbar />
        <div className='pt-24'>
          <h1 className='text-xl'>Task Notifications</h1>
          {loading ? (
            <p className='mt-4'>Loading notifications...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index}>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.created_at).toLocaleString()}</small>
                  </li>
                ))
              ) : (
                <p className='text-center mt-24'>No notifications available.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskNotifications;
