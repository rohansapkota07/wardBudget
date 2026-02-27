import React, { useState } from 'react';
import { MOCK_ENTRIES, CATEGORIES, STATUS, formatNPR, getStatusBadgeClass } from '../mockData';

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const totalAllocated = MOCK_ENTRIES.reduce((s, e) => s + e.amountNPR, 0);
  const totalSpent     = MOCK_ENTRIES.reduce((s, e) => s + e.spentNPR, 0);
  const completedCount = MOCK_ENTRIES.filter(e => e.status === STATUS.COMPLETED).length;
  const flaggedCount   = MOCK_ENTRIES.filter(e => e.status === STATUS.FLAGGED || e.flags > 0).length;
  const utilization    = ((totalSpent / totalAllocated) * 100).toFixed(1);

  const filtered = MOCK_ENTRIES.filter(e => {
    const catOk = categoryFilter === 'All' || e.category === categoryFilter;
    const stOk  = statusFilter === 'All' || e.status === statusFilter;
    return catOk && stOk;
  });

  // Category breakdown for mini chart
  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: MOCK_ENTRIES.filter(e => e.category === cat).reduce((s, e) => s + e.amountNPR, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const maxCatTotal = Math.max(...catTotals.map(c => c.total));

  return (
    <div>
      <h2 className="section-title">Budget Overview</h2>
      <p className="section-sub">
        <span className="live-dot"></span>
        Live · Solana Devnet · Fiscal Year 2081/82 BS
      </p>

      {/* Key stats */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-cell">
          <div className="card-label">Total Allocated</div>
          <div className="card-value">{formatNPR(totalAllocated)}</div>
          <div className="card-unit">across {MOCK_ENTRIES.length} entries</div>
        </div>
        <div className="stat-cell">
          <div className="card-label">Total Spent</div>
          <div className="card-value" style={{ color: 'var(--yellow)' }}>{formatNPR(totalSpent)}</div>
          <div className="card-unit">{utilization}% utilization rate</div>
        </div>
        <div className="stat-cell">
          <div className="card-label">Completed Projects</div>
          <div className="card-value" style={{ color: 'var(--green)' }}>{completedCount}</div>
          <div className="card-unit">of {MOCK_ENTRIES.length} total entries</div>
        </div>
        <div className="stat-cell">
          <div className="card-label">Flagged / Under Review</div>
          <div className="card-value" style={{ color: flaggedCount > 0 ? 'var(--red)' : 'var(--text2)' }}>
            {flaggedCount}
          </div>
          <div className="card-unit">citizen flags raised</div>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 32 }}>
        {/* Category chart */}
        <div className="card">
          <div className="card-label" style={{ marginBottom: 16 }}>Budget by Category</div>
          {catTotals.map(({ cat, total }) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>{cat}</span>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{formatNPR(total)}</span>
              </div>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(total / maxCatTotal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Ward breakdown */}
        <div className="card">
          <div className="card-label" style={{ marginBottom: 16 }}>Ward Status Breakdown</div>
          {[STATUS.COMPLETED, STATUS.IN_PROGRESS, STATUS.ALLOCATED, STATUS.FLAGGED].map(st => {
            const count = MOCK_ENTRIES.filter(e => e.status === st).length;
            const total = MOCK_ENTRIES.filter(e => e.status === st).reduce((s, e) => s + e.amountNPR, 0);
            return (
              <div key={st} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={getStatusBadgeClass(st)}>{st}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>{count} entries</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{formatNPR(total)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entries table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="card-label">All Budget Entries</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {Object.values(STATUS).map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ward</th>
              <th>Title</th>
              <th>Category</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Utilization</th>
              <th>Status</th>
              <th>Flags</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entry => {
              const util = entry.amountNPR > 0
                ? ((entry.spentNPR / entry.amountNPR) * 100).toFixed(0)
                : 0;
              return (
                <tr key={entry.id}>
                  <td style={{ color: 'var(--text3)', fontSize: 10 }}>{entry.id}</td>
                  <td>{entry.wardName}</td>
                  <td style={{ color: 'var(--text)', maxWidth: 220 }}>{entry.title}</td>
                  <td><span className="tag">{entry.category}</span></td>
                  <td className="amount-cell">{formatNPR(entry.amountNPR)}</td>
                  <td style={{ color: 'var(--yellow)' }}>{formatNPR(entry.spentNPR)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar-wrap" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{ width: `${util}%` }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{util}%</span>
                    </div>
                  </td>
                  <td><span className={getStatusBadgeClass(entry.status)}>{entry.status}</span></td>
                  <td style={{ color: entry.flags > 0 ? 'var(--red)' : 'var(--text3)', fontSize: 11 }}>
                    {entry.flags > 0 ? `⚑ ${entry.flags}` : '—'}
                  </td>
                  <td>
                    <a
                      href={`https://explorer.solana.com/tx/${entry.txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="tx-link"
                    >
                      {entry.txSignature}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
            No entries match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
