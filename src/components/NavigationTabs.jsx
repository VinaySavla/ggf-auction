import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationTabs = () => {
  const location = useLocation();
  
  const tabs = [
    { name: "Players", path: "/" },
    // { name: "Teams", path: "/teams" },
    // { name: "Sold Players", path: "/sold-players" },
    // { name: "Unsold Players", path: "/unsold-players" },
    // { name: "Yet to auction Players", path: "/yet-to-auction" },
    // { name: "Updates", path: "/updates" },
  ];

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      boxSizing: 'border-box',
    },
    tabButton: {
      padding: '12px 24px',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      marginRight: '16px',
      fontSize: '16px',
      transition: 'all 0.2s',
      marginBottom: '8px',
      textDecoration: 'none', // Removes underline
      display: 'inline-block', // Ensures link behaves like a button
    },
    activeTab: {
      background: '#2563eb',
      color: 'white',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    inactiveTab: {
      background: '#f3f4f6',
      color: '#4b5563',
    },
  };

  return (
    <div style={styles.container}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          style={{
            ...styles.tabButton,
            ...(location.pathname === tab.path ? styles.activeTab : styles.inactiveTab),
          }}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default NavigationTabs;
