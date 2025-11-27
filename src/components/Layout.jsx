import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CurrentBidCard from './CurrentBidCard';
import NavigationTabs from './NavigationTabs';
import Footer from './Footer';
import TitleSponsor from './TitleSponser';

const Layout = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 300000); // Refresh every 5 minutes (300,000 ms)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  const currentBid = {
    playerName: "Vinod Kumar",
    currentAmount: "8.50 LAC",
    basePrice: "6.00 LAC",
    role: "All Rounder",
    team: "M3C",
    imageUrl: "/api/placeholder/120/120",
    highestBidder: "Pink Panthers",
    timeLeft: "30",
  };

  const styles = {
    header: {
      background: '#fff',
      color: '#1e3a8a',
      padding: '16px 0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    headerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      height: '56px',
      cursor: 'pointer',
      transition: 'transform 0.3s',
    },
    logoHover: {
      transform: 'scale(1.1)',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      margin: 0,
    },
    '@media (max-width: 768px)': {
    title: {
      fontSize: '1rem', // Reduced size for small devices
    },},
    content: {
      flex: 1,
      width: '100%',
      boxSizing: 'border-box',
      padding: '0 16px',
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={styles.header}>
  <div style={styles.headerContainer}>
    {/* Left Section: GGF Logo */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="GGF.png"
        alt="GGF Logo"
        style={styles.logo}
        onMouseOver={(e) => (e.target.style.transform = styles.logoHover.transform)}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
      />
      <p style={{ margin: '8px 0 0', fontWeight: 'bold', fontSize: '14px', textAlign:'center' }}>Godhra Graduates Forum</p>
    </div>

    {/* Middle Section: Title and Logo */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="GGFCUPLogo.png"
        alt="GGF Logo"
        style={styles.logo}
        onMouseOver={(e) => (e.target.style.transform = styles.logoHover.transform)}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
      />
      <h1 className='text-lg font-bold text-center md:text-2xl'>GGF Cup - Season 6</h1>
    </div>

    {/* Right Section: GCS Logo */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="GCS.png"
        alt="Godhra Sports Club"
        style={styles.logo}
        onMouseOver={(e) => (e.target.style.transform = styles.logoHover.transform)}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
      />
      <p style={{ margin: '8px 0 0', fontWeight: 'bold', fontSize: '14px', textAlign:'center' }}>Godhra Sports Club</p>
    </div>
  </div>
</header>

<TitleSponsor />


        {/* Current Bid Card */}
      <CurrentBidCard bid={currentBid} />

      {/* Main Content */}
      <div style={styles.content}>
        <NavigationTabs />
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
