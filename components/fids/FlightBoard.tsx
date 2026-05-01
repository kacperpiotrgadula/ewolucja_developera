'use client';

import { useEffect } from 'react';
import { FlightRow } from './FlightRow';
import { LiveClock } from './LiveClock';
import { useShallow } from 'zustand/react/shallow';
import { useFlightsStore, selectFilteredFlights } from '@/store/flightsStore';
import type { Flight, FlightStatus, Terminal, SortableColumn, SortState } from '@/types';
import { ALL_AIRLINES, ALL_STATUSES, ALL_TERMINALS } from '@/types';

function SortIndicator({ column, sort }: { column: SortableColumn; sort: SortState }) {
  if (sort.column !== column) return null;
  return (
    <span className="ml-1 font-bold text-cyan-300" aria-hidden="true">
      {sort.direction === 'asc' ? '▲' : '▼'}
    </span>
  );
}

interface FlightBoardProps {
  initialFlights: Flight[];
}

export function FlightBoard({ initialFlights }: FlightBoardProps) {
  const { filters, setFilter, setFlights, sort, setSort } = useFlightsStore();
  const flights = useFlightsStore(useShallow(selectFilteredFlights));

  useEffect(() => {
    setFlights(initialFlights);
  }, [initialFlights, setFlights]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(34,197,94,0.1)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(34,197,94,0.1)_1px,_transparent_1px)] bg-[40px_40px]"></div>
      </div>
      
      {/* Glow effects */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur border-b border-cyan-500/30 px-8 py-6 flex items-center justify-between" style={{
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent uppercase" style={{
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.12em'
          }}>
            ✈ RunwayBriefing
          </h1>
          <p className="text-xs text-cyan-400/60 tracking-wider uppercase font-medium" style={{
            fontFamily: '"Courier New", monospace'
          }}>
            Live Flight Intelligence Display
          </p>
        </div>
        <LiveClock />
      </header>

      {/* Filters */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900/40 to-slate-800/40 backdrop-blur border-b border-cyan-500/20 px-8 py-4 flex flex-wrap gap-4 items-center">
        <span className="text-xs text-cyan-400/70 uppercase tracking-wider font-semibold">🔍 Filter:</span>

        <select
          value={filters.terminal}
          onChange={(e) => setFilter('terminal', e.target.value as Terminal | 'All')}
          className="bg-slate-900/60 border border-cyan-500/30 text-cyan-100 text-xs px-3 py-2 rounded transition-all hover:border-cyan-400/60 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/30 backdrop-blur"
        >
          <option value="All">All Terminals</option>
          {ALL_TERMINALS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={filters.airline}
          onChange={(e) => setFilter('airline', e.target.value)}
          className="bg-slate-900/60 border border-cyan-500/30 text-cyan-100 text-xs px-3 py-2 rounded transition-all hover:border-cyan-400/60 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/30 backdrop-blur"
        >
          <option value="All">All Airlines</option>
          {ALL_AIRLINES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value as FlightStatus | 'All')}
          className="bg-slate-900/60 border border-cyan-500/30 text-cyan-100 text-xs px-3 py-2 rounded transition-all hover:border-cyan-400/60 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/30 backdrop-blur"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={filters.destination}
          onChange={(e) => setFilter('destination', e.target.value)}
          placeholder="Search destination…"
          className="bg-slate-900/60 border border-cyan-500/30 text-cyan-100 text-xs px-3 py-2 rounded transition-all hover:border-cyan-400/60 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/30 placeholder:text-cyan-500/40 w-48 backdrop-blur"
        />

        <span className="ml-auto text-xs text-cyan-400/60 font-mono">
          {flights.length} flight{flights.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Column headers */}
      <div className="relative z-10 grid grid-cols-[120px_160px_1fr_80px_60px_60px_140px] gap-2 px-8 py-3 text-xs text-cyan-400/60 uppercase tracking-wider border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/60 to-slate-800/40 backdrop-blur font-semibold" style={{
        fontFamily: '"Courier New", monospace'
      }}>
        <span>✦ Flight</span>
        <span>✦ Airline</span>
        <span>✦ Destination</span>
        <button
          onClick={() => setSort('departureTime')}
          className="text-center flex items-center justify-center gap-1 transition-all cursor-pointer focus:outline-none rounded-sm hover:text-cyan-300"
        >
          ✦ Time<SortIndicator column="departureTime" sort={sort} />
        </button>
        <button
          onClick={() => setSort('terminal')}
          className="text-center flex items-center justify-center gap-1 transition-all cursor-pointer focus:outline-none rounded-sm hover:text-cyan-300"
        >
          ✦ Term<SortIndicator column="terminal" sort={sort} />
        </button>
        <span className="text-center">✦ Gate</span>
        <button
          onClick={() => setSort('status')}
          className="flex items-center justify-center gap-1 transition-all cursor-pointer focus:outline-none rounded-sm hover:text-cyan-300"
        >
          ✦ Status<SortIndicator column="status" sort={sort} />
        </button>
      </div>

      {/* Flights */}
      <div className="relative z-10">
        {flights.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <p className="text-cyan-400/40 text-sm font-light">No flights match the current filters.</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-4 py-2">
            {flights.map((flight, i) => <FlightRow key={flight.id} flight={flight} index={i} />)}
          </div>
        )}
      </div>

      {/* Admin link */}
      <div className="fixed bottom-4 right-4 z-20">
        <a
          href="/admin"
          className="text-xs text-cyan-400/60 hover:text-cyan-300 transition-all border border-cyan-500/30 px-4 py-2 rounded backdrop-blur bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-400/60 font-mono"
        >
          → Admin
        </a>
      </div>
    </div>
  );
}
