import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMemo, useState, useEffect } from "react";
import idl from "../idl/ward_budget.json";

/* -------------------------------------------------- */
/* 🔹 Replace with your deployed Program ID */
/* -------------------------------------------------- */
const PROGRAM_ID = new PublicKey(
  "3VPYrrEJbdGsDQFMqYvJGLst5pnyL8xpyrbYbZQTYfBM"
);

/* ================================================== */
/* 🧠 useProgram Hook */
/* ================================================== */
export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet?.publicKey) return null;

    try {
      const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });

      // ✅ Correct Program instantiation
      return new Program(PROGRAM_ID, idl, provider);
    } catch (err) {
      console.error("Program init failed:", err);
      return null;
    }
  }, [connection, wallet]);

  return { program, wallet, connection };
}

/* ================================================== */
/* 🔹 PDA Helpers */
/* ================================================== */

export function getBudgetEntryPDA(entryId) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("budget_entry"), Buffer.from(entryId)],
    PROGRAM_ID
  );
  return pda;
}

export function getFlagRecordPDA(entryId, citizenPubkey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("flag_record"), Buffer.from(entryId), citizenPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getVoteRecordPDA(entryId, citizenPubkey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vote_record"), Buffer.from(entryId), citizenPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

/* ================================================== */
/* 🔹 Fetch Helpers */
/* ================================================== */

export async function fetchAllEntries(program) {
  if (!program) return [];

  try {
    const entries = await program.account.budgetEntry.all();

    return entries.map(({ publicKey, account }) => ({
      pubkey: publicKey.toString(),
      entryId: account.entryId,
      wardId: account.wardId,
      title: account.title,
      description: account.description,
      category: account.category,
      amountNPR: account.amountNpr.toNumber(),
      spentNPR: account.spentNpr.toNumber(),
      status: parseStatus(account.status),
      authority: account.authority.toString(),
      timestamp: account.timestamp.toNumber(),
      flags: account.flags,
      supportVotes: account.supportVotes,
      opposeVotes: account.opposeVotes,
    }));
  } catch (err) {
    console.error("Failed to fetch entries:", err);
    return [];
  }
}

/* ================================================== */
/* 🔹 Live subscription hook */
/* ================================================== */

export function useAllEntries(program) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!program) return;

    let isMounted = true;

    // Initial fetch
    const fetchData = async () => {
      const data = await fetchAllEntries(program);
      if (isMounted) setEntries(data);
    };
    fetchData();

    // Subscribe to updates for budgetEntry accounts
    const listener = program.account.budgetEntry.subscribe((updatedAccount, publicKey) => {
      setEntries(prev =>
        prev.map(e =>
          e.pubkey === publicKey.toString()
            ? { ...e, ...updatedAccount }
            : e
        )
      );
    });

    return () => {
      isMounted = false;
      // Unsubscribe on cleanup
      if (listener) listener.unsubscribe();
    };
  }, [program]);

  return entries;
}

/* ================================================== */
/* 🔹 Status Helpers */
/* ================================================== */

export function parseStatus(status) {
  if (status.allocated) return "Allocated";
  if (status.inProgress) return "In Progress";
  if (status.completed) return "Completed";
  if (status.flagged) return "Flagged";
  return "Unknown";
}

export function statusToArg(statusStr) {
  switch (statusStr) {
    case "Allocated":
      return { allocated: {} };
    case "In Progress":
      return { inProgress: {} };
    case "Completed":
      return { completed: {} };
    case "Flagged":
      return { flagged: {} };
    default:
      return { allocated: {} };
  }
}

/* ================================================== */
/* 🔹 Re-exports */
/* ================================================== */
export { BN, SystemProgram };