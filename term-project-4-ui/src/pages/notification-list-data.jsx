import React, { useState, useEffect } from 'react';
import echo from '../server/echo';  // Assuming Laravel Echo instance is properly set up
import { notificationData } from '../server/api';  // Your notification data fetch function

const TaskNotifications = ({ userId, token }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notification data from backend
        const response = await notificationData({ page: 1, range: 10 }, token);  // Pass required params
        setNotifications(response.data);  // Update notifications state
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('There was an error fetching notifications.');
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchNotifications();

    const channel = echo.private(`user.${userId}`);

    // Listen for the TaskNotification event
    channel.listen('.TaskNotification', (event) => {
      // console.log('Notification received:', event);
      //fetch with notification api

      // Add the new notification to the state
      setNotifications((prevNotifications) => [event, ...prevNotifications]);
    });

    // Cleanup listener on component unmount
    return () => {
      channel.stopListening('.TaskNotification');
    };
  }, [userId, token]);  // Re-fetch data when userId or token changes

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Task Notifications</h1>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index}>
              <p>{notification.message}</p>
              <small>{new Date(notification.created_at).toLocaleString()}</small>
            </li>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskNotifications;
