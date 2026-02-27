import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WARDS, CATEGORIES, STATUS, formatNPR, getStatusBadgeClass, MOCK_ENTRIES } from '../mockData';

// ─────────────────────────────────────────────────────────────────
// AdminPanel — Ward officials post budget entries on-chain
// In production: calls your Anchor program's "add_budget_entry" ix
// ─────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [form, setForm] = useState({
    wardId: WARDS[0].id,
    title: '',
    description: '',
    category: CATEGORIES[0],
    amountNPR: '',
  });

  const [entries, setEntries] = useState(MOCK_ENTRIES.filter(e => e.wardId <= 2)); // admin sees own ward
  const [submitting, setSubmitting] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [error, setError] = useState(null);
  const [updateForm, setUpdateForm] = useState({ id: null, status: '', spentNPR: '' });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.amountNPR || isNaN(form.amountNPR) || Number(form.amountNPR) <= 0) {
      setError('Enter a valid amount.'); return;
    }

    setSubmitting(true);
    try {
      // ─── Simulated on-chain call ───────────────────────────────
      // TODO: Replace with real Anchor program interaction:
      //   const program = new Program(idl, programId, provider);
      //   const [entryPDA] = PublicKey.findProgramAddressSync(
      //     [Buffer.from('budget_entry'), Buffer.from(entryId)],
      //     program.programId
      //   );
      //   const tx = await program.methods
      //     .addBudgetEntry(form.wardId, form.title, new BN(form.amountNPR), form.category)
      //     .accounts({ entry: entryPDA, authority: publicKey, systemProgram: SystemProgram.programId })
      //     .rpc();
      // ──────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 1400)); // simulate tx confirmation

      const fakeSignature = Math.random().toString(36).substring(2, 8).toUpperCase() + '...' +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      const newEntry = {
        id: `ENT${String(entries.length + 100).padStart(3, '0')}`,
        txSignature: fakeSignature,
        wardId: Number(form.wardId),
        wardName: WARDS.find(w => w.id === Number(form.wardId))?.name || '',
        title: form.title,
        description: form.description,
        category: form.category,
        amountNPR: Number(form.amountNPR),
        spentNPR: 0,
        status: STATUS.ALLOCATED,
        postedBy: publicKey ? publicKey.toString().slice(0, 6) + '...' + publicKey.toString().slice(-4) : 'Unknown',
        postedAt: new Date().toISOString(),
        flags: 0,
      };

      setEntries(prev => [newEntry, ...prev]);
      setLastTx(fakeSignature);
      setForm({ wardId: WARDS[0].id, title: '', description: '', category: CATEGORIES[0], amountNPR: '' });
    } catch (err) {
      setError('Transaction failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = (entryId) => {
    if (!updateForm.status) return;
    setEntries(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      return {
        ...e,
        status: updateForm.status,
        spentNPR: updateForm.spentNPR ? Number(updateForm.spentNPR) : e.spentNPR,
      };
    }));
    setUpdateForm({ id: null, status: '', spentNPR: '' });
  };

  return (
    <div>
      <h2 className="section-title">Ward Admin Panel</h2>
      <p className="section-sub">Post & manage budget entries on-chain</p>

      {publicKey && (
        <div className="info-box" style={{ marginBottom: 24 }}>
          <span className="chain-label">
            <span className="live-dot"></span>
            Signed in as ward official — {publicKey.toString()}
          </span>
        </div>
      )}

      <div className="two-col">
        {/* Post new entry form */}
        <div>
          <div className="card">
            <div className="card-label" style={{ marginBottom: 18, fontSize: 12 }}>
              ◈ Post New Budget Entry
            </div>

            {error && (
              <div style={{
                background: 'rgba(255,92,92,0.1)', border: '1px solid var(--red)',
                padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--red)'
              }}>
                {error}
              </div>
            )}

            {lastTx && (
              <div style={{
                background: 'rgba(0,212,170,0.1)', border: '1px solid var(--accent)',
                padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--accent)'
              }}>
                ✓ Entry posted on-chain · Tx: <code style={{ fontSize: 10 }}>{lastTx}</code>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Ward</label>
              <select
                className="form-select"
                value={form.wardId}
                onChange={e => handleChange('wardId', e.target.value)}
              >
                {WARDS.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Road Repair – Main Street"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe the project scope, beneficiaries, timeline..."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>

            <div className="two-col" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Budget Amount (NPR)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 500000"
                  value={form.amountNPR}
                  onChange={e => handleChange('amountNPR', e.target.value)}
                />
              </div>
            </div>

            {form.amountNPR && !isNaN(form.amountNPR) && (
              <div style={{ marginBottom: 16, fontSize: 11, color: 'var(--text3)' }}>
                Formatted: <span style={{ color: 'var(--accent)' }}>{formatNPR(Number(form.amountNPR))}</span>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%' }}
            >
              {submitting ? '◉ Confirming on Solana...' : '◈ Post to Blockchain'}
            </button>

            <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 10, textAlign: 'center' }}>
              This action will be publicly visible and immutable on Solana Devnet.
            </p>
          </div>
        </div>

        {/* Entry management */}
        <div>
          <div className="card-label" style={{ marginBottom: 14 }}>Your Posted Entries</div>
          {entries.length === 0 && (
            <p style={{ color: 'var(--text3)', fontSize: 12 }}>No entries yet. Post your first budget entry.</p>
          )}
          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 700, marginBottom: 4 }}>
                    {entry.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8 }}>
                    {entry.wardName} · {entry.category} · Posted {new Date(entry.postedAt).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                      {formatNPR(entry.amountNPR)}
                    </span>
                    <span className={getStatusBadgeClass(entry.status)}>{entry.status}</span>
                    {entry.flags > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--red)' }}>⚑ {entry.flags} flags</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Update status inline */}
              {updateForm.id === entry.id ? (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <select
                    className="form-select"
                    style={{ flex: 1, padding: '6px 8px' }}
                    value={updateForm.status}
                    onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))}
                  >
                    <option value="">Select status</option>
                    {Object.values(STATUS).map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Spent (NPR)"
                    style={{ flex: 1 }}
                    value={updateForm.spentNPR}
                    onChange={e => setUpdateForm(p => ({ ...p, spentNPR: e.target.value }))}
                  />
                  <button className="btn btn-primary" onClick={() => handleStatusUpdate(entry.id)}>
                    Update
                  </button>
                  <button className="btn btn-ghost" onClick={() => setUpdateForm({ id: null, status: '', spentNPR: '' })}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: 10, fontSize: 10, padding: '5px 12px' }}
                  onClick={() => setUpdateForm({ id: entry.id, status: entry.status, spentNPR: entry.spentNPR })}
                >
                  Update Status / Spending
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
