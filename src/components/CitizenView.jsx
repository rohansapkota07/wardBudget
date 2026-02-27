import React, { useState } from 'react';
import { MOCK_ENTRIES, WARDS, STATUS, formatNPR, getStatusBadgeClass } from '../mockData';

// ─────────────────────────────────────────────────────────────────────────────
// CitizenView — Public view for any Nepal citizen (no wallet required)
// Can filter by ward, see spending details, and flag suspicious entries
// ─────────────────────────────────────────────────────────────────────────────

export default function CitizenView() {
  const [selectedWard, setSelectedWard] = useState('All');
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [flagged, setFlagged] = useState({});       // entryId → true if user flagged this session
  const [expanded, setExpanded] = useState(null);  // entryId being expanded

  const filteredEntries = selectedWard === 'All'
    ? entries
    : entries.filter(e => e.wardName === selectedWard);

  const handleFlag = (entryId) => {
    if (flagged[entryId]) return;
    setFlagged(prev => ({ ...prev, [entryId]: true }));
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, flags: e.flags + 1, status: e.flags + 1 >= 3 ? STATUS.FLAGGED : e.status }
        : e
    ));
    // TODO: In production, this submits a flag transaction on-chain
    // const tx = await program.methods.flagEntry(entryId).accounts({...}).rpc();
  };

  const wardStats = WARDS.map(w => {
    const wardEntries = entries.filter(e => e.wardId === w.id);
    return {
      ...w,
      count: wardEntries.length,
      totalAllocated: wardEntries.reduce((s, e) => s + e.amountNPR, 0),
      totalSpent: wardEntries.reduce((s, e) => s + e.spentNPR, 0),
      flagged: wardEntries.filter(e => e.flags > 0).length,
    };
  }).filter(w => w.count > 0);

  return (
    <div>
      <h2 className="section-title">Citizen Transparency View</h2>
      <p className="section-sub">
        <span className="live-dot"></span>
        No wallet required · All data is public · Powered by Solana
      </p>

      <div className="info-box">
        This view is accessible to any citizen of Nepal — no wallet, no login required.
        You can browse all ward budget entries, track spending progress, and raise a flag
        if you believe a project is misallocated or fraudulent. Flags are recorded on-chain
        and trigger a review process.
      </div>

      {/* Ward selector cards */}
      <div className="three-col" style={{ marginBottom: 28 }}>
        <div
          className="card"
          onClick={() => setSelectedWard('All')}
          style={{
            cursor: 'pointer',
            borderColor: selectedWard === 'All' ? 'var(--accent)' : 'var(--border)',
            transition: 'border-color 0.15s'
          }}
        >
          <div className="card-label">All Wards</div>
          <div className="card-value">{entries.length}</div>
          <div className="card-unit">total entries</div>
        </div>
        {wardStats.map(w => (
          <div
            key={w.id}
            className="card"
            onClick={() => setSelectedWard(w.name)}
            style={{
              cursor: 'pointer',
              borderColor: selectedWard === w.name ? 'var(--accent)' : 'var(--border)',
              transition: 'border-color 0.15s'
            }}
          >
            <div className="card-label">{w.name}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', margin: '6px 0' }}>
              {formatNPR(w.totalAllocated)}
            </div>
            <div className="card-unit">
              {w.count} entries ·&nbsp;
              {w.flagged > 0
                ? <span style={{ color: 'var(--red)' }}>{w.flagged} flagged</span>
                : 'no flags'
              }
            </div>
          </div>
        ))}
      </div>

      {/* Entry cards */}
      <div className="card-label" style={{ marginBottom: 14 }}>
        {filteredEntries.length} Entries
        {selectedWard !== 'All' ? ` — ${selectedWard}` : ''}
      </div>

      {filteredEntries.map(entry => {
        const utilPct = entry.amountNPR > 0
          ? Math.round((entry.spentNPR / entry.amountNPR) * 100)
          : 0;
        const isExpanded = expanded === entry.id;

        return (
          <div
            key={entry.id}
            style={{
              background: 'var(--bg2)',
              border: `1px solid ${entry.status === STATUS.FLAGGED ? 'var(--red)' : 'var(--border)'}`,
              marginBottom: 12,
              transition: 'all 0.15s',
            }}
          >
            {/* Entry header */}
            <div
              style={{ padding: '16px 18px', cursor: 'pointer' }}
              onClick={() => setExpanded(isExpanded ? null : entry.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span className={getStatusBadgeClass(entry.status)}>{entry.status}</span>
                    <span className="tag">{entry.category}</span>
                    {entry.flags > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700 }}>
                        ⚑ {entry.flags} citizen flags
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 700, marginBottom: 3 }}>
                    {entry.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                    {entry.wardName} · Posted {new Date(entry.postedAt).toLocaleDateString('en-NP')}
                    &nbsp;· By {entry.postedBy}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, color: 'var(--accent)', fontWeight: 700 }}>
                    {formatNPR(entry.amountNPR)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--yellow)' }}>
                    Spent: {formatNPR(entry.spentNPR)} ({utilPct}%)
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 12 }}>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${utilPct}%` }} />
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '16px 18px',
                background: 'var(--bg3)',
              }}>
                <div className="two-col" style={{ gap: 20 }}>
                  <div>
                    <div className="card-label" style={{ marginBottom: 6 }}>Project Description</div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                      {entry.description || 'No description provided.'}
                    </p>

                    <div style={{ marginTop: 16 }}>
                      <div className="card-label" style={{ marginBottom: 6 }}>On-Chain Transaction</div>
                      <a
                        href={`https://explorer.solana.com/tx/${entry.txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="tx-link"
                      >
                        🔗 {entry.txSignature} — View on Solana Explorer
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="card-label" style={{ marginBottom: 6 }}>Spending Breakdown</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'Allocated', value: formatNPR(entry.amountNPR), color: 'var(--accent)' },
                        { label: 'Spent', value: formatNPR(entry.spentNPR), color: 'var(--yellow)' },
                        { label: 'Remaining', value: formatNPR(entry.amountNPR - entry.spentNPR), color: 'var(--blue)' },
                        { label: 'Utilization', value: `${utilPct}%`, color: 'var(--text)' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: 'var(--bg2)', padding: '10px 12px', border: '1px solid var(--border)' }}>
                          <div className="card-label">{label}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div className="card-label" style={{ marginBottom: 8 }}>Citizen Actions</div>
                      {flagged[entry.id] ? (
                        <div style={{ fontSize: 12, color: 'var(--red)' }}>
                          ⚑ You flagged this entry. It will be reviewed by ward officials.
                        </div>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={(e) => { e.stopPropagation(); handleFlag(entry.id); }}
                          style={{ fontSize: 11 }}
                        >
                          ⚑ Flag as Suspicious
                        </button>
                      )}
                      <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>
                        Flags are recorded on-chain. 3+ flags trigger automatic review status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
