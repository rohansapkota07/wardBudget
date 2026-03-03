import React, { useState, useEffect } from 'react';
import { SystemProgram } from "@solana/web3.js"
import { BN } from '@coral-xyz/anchor';
import { useProgram, getBudgetEntryPDA, fetchAllEntries, statusToArg } from '../hooks/useProgram';
import { WARDS, CATEGORIES, STATUS, formatNPR, getStatusBadgeClass } from '../mockData';

export default function AdminPanel() {
  const { program, wallet } = useProgram();

  const [form, setForm] = useState({
    entryId:     '',
    wardId:      WARDS[0].id,
    title:       '',
    description: '',
    category:    CATEGORIES[0],
    amountNPR:   '',
  });

  const [entries, setEntries]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastTx, setLastTx]         = useState(null);
  const [error, setError]           = useState(null);
  const [updateForm, setUpdateForm] = useState({ id: null, pubkey: null, status: '', spentNPR: '' });

  useEffect(() => {
    if (!program) return;
    loadEntries();
  }, [program]);

  const loadEntries = async () => {
    setLoading(true);
    const all = await fetchAllEntries(program);
    const mine = all.filter(e => e.authority === wallet.publicKey?.toString());
    setEntries(mine);
    setLoading(false);
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError(null);
    if (!program)                 { setError('Wallet not connected.'); return; }
    if (!form.entryId.trim())     { setError('Entry ID is required.'); return; }
    if (form.entryId.length > 16) { setError('Entry ID max 16 characters.'); return; }
    if (!form.title.trim())       { setError('Title is required.'); return; }
    if (!form.amountNPR || Number(form.amountNPR) <= 0) { setError('Enter a valid amount.'); return; }

    setSubmitting(true);
    try {
      const entryPDA = getBudgetEntryPDA(form.entryId);
      const tx = await program.methods
        .addBudgetEntry(form.entryId, Number(form.wardId), form.title, form.description, form.category, new BN(form.amountNPR))
        .accounts({ budgetEntry: entryPDA, authority: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();

      setLastTx(tx);
      setForm({ entryId: '', wardId: WARDS[0].id, title: '', description: '', category: CATEGORIES[0], amountNPR: '' });
      await loadEntries();
    } catch (err) {
      setError('Transaction failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (entryPubkey) => {
    if (!updateForm.status) return;
    setSubmitting(true);
    try {
      await program.methods
        .updateBudgetEntry(statusToArg(updateForm.status), new BN(updateForm.spentNPR || 0))
        .accounts({ budgetEntry: entryPubkey, authority: wallet.publicKey })
        .rpc();
      setUpdateForm({ id: null, pubkey: null, status: '', spentNPR: '' });
      await loadEntries();
    } catch (err) {
      setError('Update failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">Ward Admin Panel</h2>
      <p className="section-sub">Post & manage budget entries on-chain</p>

      {wallet.publicKey && (
        <div className="info-box" style={{ marginBottom: 24 }}>
          <span className="chain-label"><span className="live-dot"></span>SIGNED IN — Municipality Admin · {wallet.publicKey.toString().slice(0,6)}...{wallet.publicKey.toString().slice(-4)}</span>
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-label" style={{ marginBottom: 18, fontSize: 12 }}>◈ Post New Budget Entry</div>

            {error && (
              <div style={{ background: 'rgba(255,92,92,0.1)', border: '1px solid var(--red)', padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--red)' }}>
                {error}
              </div>
            )}

            {lastTx && (
              <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid var(--accent)', padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--accent)' }}>
                ✓ Posted on-chain!{' '}
                <a href={`https://explorer.solana.com/tx/${lastTx}?cluster=devnet`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: 10 }}>
                  View on Explorer →
                </a>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Entry ID <span style={{ color: 'var(--text3)' }}>(unique, max 16 chars)</span></label>
              <input className="form-input" type="text" placeholder="e.g. ENT001" maxLength={16} value={form.entryId} onChange={e => handleChange('entryId', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Ward</label>
              <select className="form-select" value={form.wardId} onChange={e => handleChange('wardId', e.target.value)}>
                {WARDS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input className="form-input" type="text" placeholder="e.g. Road Repair – Main Street" value={form.title} onChange={e => handleChange('title', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the project scope, beneficiaries, timeline..." value={form.description} onChange={e => handleChange('description', e.target.value)} />
            </div>

            <div className="two-col" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Budget Amount (NPR)</label>
                <input className="form-input" type="number" placeholder="e.g. 500000" value={form.amountNPR} onChange={e => handleChange('amountNPR', e.target.value)} />
              </div>
            </div>

            {form.amountNPR && !isNaN(form.amountNPR) && (
              <div style={{ marginBottom: 16, fontSize: 11, color: 'var(--text3)' }}>
                Formatted: <span style={{ color: 'var(--accent)' }}>{formatNPR(Number(form.amountNPR))}</span>
              </div>
            )}

            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !program} style={{ width: '100%' }}>
              {submitting ? '◉ Confirming on Solana...' : '◈ Post to Blockchain'}
            </button>
            <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 10, textAlign: 'center' }}>
              This action will be publicly visible and immutable on Solana Devnet.
            </p>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="card-label">Your Posted Entries</div>
            <button className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 10px' }} onClick={loadEntries}>↻ Refresh</button>
          </div>

          {loading && <p style={{ color: 'var(--text3)', fontSize: 12 }}>Loading from chain...</p>}
          {!loading && entries.length === 0 && <p style={{ color: 'var(--text3)', fontSize: 12 }}>No entries yet. Post your first budget entry.</p>}

          {entries.map(entry => (
            <div key={entry.entryId} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 700, marginBottom: 4 }}>{entry.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8 }}>
                {entry.category} · {new Date(entry.timestamp * 1000).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>{formatNPR(entry.amountNPR)}</span>
                <span className={getStatusBadgeClass(entry.status)}>{entry.status}</span>
                {entry.flags > 0 && <span style={{ fontSize: 10, color: 'var(--red)' }}>⚑ {entry.flags} flags</span>}
              </div>

              {updateForm.id === entry.entryId ? (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <select className="form-select" style={{ flex: 1, padding: '6px 8px' }} value={updateForm.status} onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="">Select status</option>
                    {Object.values(STATUS).map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input className="form-input" type="number" placeholder="Spent (NPR)" style={{ flex: 1 }} value={updateForm.spentNPR} onChange={e => setUpdateForm(p => ({ ...p, spentNPR: e.target.value }))} />
                  <button className="btn btn-primary" disabled={submitting} onClick={() => handleStatusUpdate(entry.pubkey)}>{submitting ? '...' : 'Update'}</button>
                  <button className="btn btn-ghost" onClick={() => setUpdateForm({ id: null, pubkey: null, status: '', spentNPR: '' })}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-ghost" style={{ marginTop: 10, fontSize: 10, padding: '5px 12px' }} onClick={() => setUpdateForm({ id: entry.entryId, pubkey: entry.pubkey, status: entry.status, spentNPR: entry.spentNPR })}>
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
