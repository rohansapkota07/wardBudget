import React, { useState, useEffect } from 'react';
import { SystemProgram } from '@solana/web3.js';
import { useProgram, getFlagRecordPDA, getVoteRecordPDA, fetchAllEntries } from '../hooks/useProgram';
import { WARDS, STATUS, formatNPR, getStatusBadgeClass } from '../mockData';

export default function CitizenView() {
  const { program, wallet } = useProgram();
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [flagged, setFlagged]   = useState({});
  const [voted, setVoted]       = useState({});
  const [flagging, setFlagging] = useState({});
  const [voting, setVoting]     = useState({});
  const [selectedWard, setSelectedWard] = useState('All');

  useEffect(() => { loadEntries(); }, [program]);

  const loadEntries = async () => {
    setLoading(true);
    if (program) {
      const all = await fetchAllEntries(program);
      setEntries(all);
    }
    setLoading(false);
  };

  const filtered = selectedWard === 'All'
    ? entries
    : entries.filter(e => e.wardId === Number(selectedWard));

  const handleFlag = async (entry) => {
    if (!wallet.publicKey) { alert('Connect wallet to flag entries.'); return; }
    if (flagged[entry.entryId]) return;
    setFlagging(p => ({ ...p, [entry.entryId]: true }));
    try {
      const flagPDA = getFlagRecordPDA(entry.entryId, wallet.publicKey);
      await program.methods.flagEntry()
        .accounts({ budgetEntry: entry.pubkey, flagRecord: flagPDA, citizen: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      setFlagged(p => ({ ...p, [entry.entryId]: true }));
      await loadEntries();
    } catch (err) {
      if (err.message.includes('AlreadyFlagged')) setFlagged(p => ({ ...p, [entry.entryId]: true }));
      else alert('Flag failed: ' + err.message);
    } finally { setFlagging(p => ({ ...p, [entry.entryId]: false })); }
  };

  const handleVote = async (entry, voteType) => {
    if (!wallet.publicKey) { alert('Connect wallet to vote.'); return; }
    if (voted[entry.entryId]) return;
    setVoting(p => ({ ...p, [entry.entryId]: voteType }));
    try {
      const votePDA = getVoteRecordPDA(entry.entryId, wallet.publicKey);
      const voteArg = voteType === 'support' ? { support: {} } : { oppose: {} };
      await program.methods.voteEntry(voteArg)
        .accounts({ budgetEntry: entry.pubkey, voteRecord: votePDA, citizen: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      setVoted(p => ({ ...p, [entry.entryId]: voteType }));
      await loadEntries();
    } catch (err) {
      if (err.message.includes('AlreadyVoted')) setVoted(p => ({ ...p, [entry.entryId]: 'already' }));
      else alert('Vote failed: ' + err.message);
    } finally { setVoting(p => ({ ...p, [entry.entryId]: false })); }
  };

  return (
    <div>
      <h2 className="section-title">Citizen Transparency View</h2>
      <p className="section-sub">
        <span className="live-dot"></span>
        Live from Solana Devnet · All data is public and immutable
      </p>
      <div className="info-box" style={{ marginBottom: 24 }}>
        Browse all ward budget entries. Connect wallet to <strong>vote</strong> on priorities or <strong>flag</strong> suspicious entries — all recorded on-chain.
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className={'btn ' + (selectedWard === 'All' ? 'btn-primary' : 'btn-ghost')} onClick={() => setSelectedWard('All')}>All Wards</button>
        {[...Array(14)].map((_, i) => (
          <button key={i+1} className={'btn ' + (selectedWard === String(i+1) ? 'btn-primary' : 'btn-ghost')} style={{ fontSize: 10, padding: '4px 10px' }} onClick={() => setSelectedWard(String(i+1))}>
            Ward {i+1}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="card-label">{filtered.length} {filtered.length === 1 ? 'Entry' : 'Entries'}</div>
        <button className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 10px' }} onClick={loadEntries}>Refresh</button>
      </div>

      {loading && <p style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center', padding: 40 }}>Loading from Solana Devnet...</p>}
      {!loading && filtered.length === 0 && <p style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center', padding: 40 }}>No entries found.</p>}

      {filtered.map(entry => {
        const utilPct    = entry.amountNPR > 0 ? Math.round((entry.spentNPR / entry.amountNPR) * 100) : 0;
        const isExpanded = expanded === entry.entryId;
        const totalVotes = (entry.supportVotes || 0) + (entry.opposeVotes || 0);
        const supportPct = totalVotes > 0 ? Math.round(((entry.supportVotes || 0) / totalVotes) * 100) : 0;
        const ward       = WARDS.find(w => w.id === entry.wardId);
        const myVote     = voted[entry.entryId];

        return (
          <div key={entry.entryId} style={{ background: 'var(--bg2)', border: '1px solid ' + (entry.status === STATUS.FLAGGED ? 'var(--red)' : 'var(--border)'), marginBottom: 12 }}>
            <div style={{ padding: '16px 18px', cursor: 'pointer' }} onClick={() => setExpanded(isExpanded ? null : entry.entryId)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span className={getStatusBadgeClass(entry.status)}>{entry.status}</span>
                    <span className="tag">{entry.category}</span>
                    <span className="tag">{ward ? ward.name : 'Ward ' + entry.wardId}</span>
                    {entry.flags > 0 && <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700 }}>⚑ {entry.flags}</span>}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 700, marginBottom: 3 }}>{entry.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{new Date(entry.timestamp * 1000).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, color: 'var(--accent)', fontWeight: 700 }}>{formatNPR(entry.amountNPR)}</div>
                  <div style={{ fontSize: 11, color: 'var(--yellow)' }}>Spent: {formatNPR(entry.spentNPR)}</div>
                  <div style={{ fontSize: 11, marginTop: 4, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <span style={{ color: 'var(--green)' }}>+{entry.supportVotes || 0}</span>
                    <span style={{ color: 'var(--red)' }}>-{entry.opposeVotes || 0}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: utilPct + '%' }} /></div>
              </div>
              {totalVotes > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>Community Support: {supportPct}% ({totalVotes} votes)</div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: supportPct + '%', background: 'var(--green)' }} />
                  </div>
                </div>
              )}
            </div>

            {isExpanded && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px', background: 'var(--bg3)' }}>
                <div className="two-col" style={{ gap: 20 }}>
                  <div>
                    <div className="card-label" style={{ marginBottom: 6 }}>Description</div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>{entry.description || 'No description.'}</p>
                    <div style={{ marginTop: 16 }}>
                      <a href={'https://explorer.solana.com/address/' + entry.pubkey + '?cluster=devnet'} target="_blank" rel="noreferrer" className="tx-link">View on Solana Explorer</a>
                    </div>
                  </div>
                  <div>
                    <div className="card-label" style={{ marginBottom: 10 }}>Cast Your Vote</div>
                    {myVote ? (
                      <div style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>
                        You voted: {myVote === 'support' ? 'Support' : 'Oppose'} — recorded on-chain
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                        <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} disabled={!!voting[entry.entryId] || !wallet.publicKey} onClick={(e) => { e.stopPropagation(); handleVote(entry, 'support'); }}>
                          {voting[entry.entryId] === 'support' ? '...' : 'Support'}
                        </button>
                        <button className="btn btn-danger" style={{ flex: 1, fontSize: 12 }} disabled={!!voting[entry.entryId] || !wallet.publicKey} onClick={(e) => { e.stopPropagation(); handleVote(entry, 'oppose'); }}>
                          {voting[entry.entryId] === 'oppose' ? '...' : 'Oppose'}
                        </button>
                      </div>
                    )}
                    <div style={{ background: 'var(--bg2)', padding: 12, border: '1px solid var(--border)', marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--green)' }}>Support: {entry.supportVotes || 0}</span>
                        <span style={{ fontSize: 11, color: 'var(--red)' }}>Oppose: {entry.opposeVotes || 0}</span>
                      </div>
                      {totalVotes > 0 && (
                        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: supportPct + '%', background: 'var(--green)' }} />
                        </div>
                      )}
                      {totalVotes === 0 && <div style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center' }}>No votes yet — be the first!</div>}
                    </div>
                    <div className="card-label" style={{ marginBottom: 8 }}>Flag as Suspicious</div>
                    {flagged[entry.entryId] ? (
                      <div style={{ fontSize: 12, color: 'var(--red)' }}>You flagged this entry.</div>
                    ) : (
                      <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleFlag(entry); }} disabled={flagging[entry.entryId]} style={{ fontSize: 11, width: '100%' }}>
                        {flagging[entry.entryId] ? '...' : 'Flag as Suspicious'}
                      </button>
                    )}
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
                      {wallet.publicKey ? '3+ flags trigger review.' : 'Connect wallet to vote or flag.'}
                    </p>
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
