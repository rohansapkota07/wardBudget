import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import CitizenView from './components/CitizenView';
import './App.css';

export default function App() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('dashboard');
  // Mock: treat connected wallet as admin for demo purposes
  // In production, this would be checked against a registry on-chain
  const isAdmin = wallet.connected;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">◈</div>
          <div>
            <h1 className="site-title">WardLedger</h1>
            <p className="site-subtitle">Nepal On-Chain Budget Transparency</p>
          </div>
        </div>
        <div className="header-right">
          <WalletMultiButton />
        </div>
      </header>

      {/* Nav */}
      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">◉</span> Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'citizen' ? 'active' : ''}`}
          onClick={() => setActiveTab('citizen')}
        >
          <span className="nav-icon">◎</span> Citizen View
        </button>
        {isAdmin && (
          <button
            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <span className="nav-icon">◈</span> Ward Admin
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'citizen' && <CitizenView />}
        {activeTab === 'admin' && isAdmin && <AdminPanel />}
        {activeTab === 'admin' && !isAdmin && (
          <div className="connect-prompt">
            <div className="connect-icon">◈</div>
            <h2>Connect your Ward Admin wallet to access this panel</h2>
            <p>Only authorized ward officials can post budget entries on-chain.</p>
            <WalletMultiButton />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built on <strong>Solana Devnet</strong> · Superteam Nepal Bounty · All data is public & immutable</p>
      </footer>
    </div>
  );
}
