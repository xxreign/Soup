"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "retro_arcade_tickets";
const DEFAULT_STARTING_TICKETS = 100;
const CUSTOM_UPDATE_EVENT = "retro_arcade_tickets_changed";

interface TicketContextType {
  /** Current ticket balance */
  tickets: number;
  /** Add tickets earned by the player. Must be a positive number. */
  addTickets: (amount: number) => void;
  /** 
   * Spend tickets (e.g. at the prize shop).
   * Returns true if the transaction succeeded.
   * Returns false if there are insufficient tickets (spending fails and count does not drop below 0).
   */
  spendTickets: (amount: number) => boolean;
  /** Reset ticket balance to initial starter amount or a specified amount (useful for testing) */
  resetTickets: (newAmount?: number) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Helpers for useSyncExternalStore
function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CUSTOM_UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CUSTOM_UPDATE_EVENT, callback);
  };
}

function getSnapshot(): number {
  if (typeof window === "undefined") return DEFAULT_STARTING_TICKETS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    } else {
      localStorage.setItem(STORAGE_KEY, DEFAULT_STARTING_TICKETS.toString());
    }
  } catch {
    // Local storage unavailable (private browsing, etc.)
  }
  return DEFAULT_STARTING_TICKETS;
}

function getServerSnapshot(): number {
  return DEFAULT_STARTING_TICKETS;
}

function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CUSTOM_UPDATE_EVENT));
  }
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  // Use React 19 recommended useSyncExternalStore for external storage
  const tickets = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addTickets = useCallback((amount: number) => {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      console.warn("addTickets: Amount must be a positive number", amount);
      return;
    }

    const cleanAmount = Math.floor(amount);
    const current = getSnapshot();
    const next = current + cleanAmount;

    try {
      localStorage.setItem(STORAGE_KEY, next.toString());
    } catch (e) {
      console.warn("Could not save tickets to localStorage:", e);
    }
    notifyUpdate();
  }, []);

  const spendTickets = useCallback((amount: number): boolean => {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      console.warn("spendTickets: Amount must be a positive number", amount);
      return false;
    }

    const cleanAmount = Math.floor(amount);
    const current = getSnapshot();

    // Check if player has enough tickets
    if (current < cleanAmount) {
      // Spending fails! Ticket count remains untouched and never drops below 0.
      return false;
    }

    // Sufficient tickets: deduct safely and ensure never below 0
    const next = Math.max(0, current - cleanAmount);
    try {
      localStorage.setItem(STORAGE_KEY, next.toString());
    } catch (e) {
      console.warn("Could not save tickets to localStorage:", e);
    }
    notifyUpdate();
    return true;
  }, []);

  const resetTickets = useCallback((newAmount: number = DEFAULT_STARTING_TICKETS) => {
    const safeAmount = Math.max(0, Math.floor(newAmount));
    try {
      localStorage.setItem(STORAGE_KEY, safeAmount.toString());
    } catch (e) {
      console.warn("Could not save tickets to localStorage:", e);
    }
    notifyUpdate();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTickets,
        spendTickets,
        resetTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

/**
 * Custom hook for games, headers, and the prize shop to access the ticket wallet.
 * 
 * Usage example:
 * ```tsx
 * const { tickets, addTickets, spendTickets } = useTickets();
 * 
 * // When player finishes a game:
 * addTickets(25);
 * 
 * // When player buys a prize:
 * const bought = spendTickets(50);
 * if (!bought) alert("Not enough tickets!");
 * ```
 */
export function useTickets(): TicketContextType {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a <TicketProvider />");
  }
  return context;
}
