import React from 'react';
import ReactDOM from 'react-dom';
import { NotificationContainer } from './notificationContainer/index';

const notificationRoot = document.getElementById('notification-root');

export const Notifications = () =>
  ReactDOM.createPortal(<NotificationContainer />, notificationRoot);
