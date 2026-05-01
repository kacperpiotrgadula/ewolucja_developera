import { create } from 'zustand';
import type { Flight, FlightStatus, Terminal, SortState, SortableColumn } from '@/types';

const STATUS_SORT_ORDER: Record<FlightStatus, number> = {
  Boarding:  0,
  Delayed:   1,
  'On Time': 2,
  Departed:  3,
  Cancelled: 4,
};

interface FiltersState {
  terminal: Terminal | 'All';
  airline: string;
  status: FlightStatus | 'All';
  destination: string;
}

interface FlightsStore {
  flights: Flight[];
  filters: FiltersState;
  sort: SortState;
  setFlights: (flights: Flight[]) => void;
  setFilter: <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => void;
  setSort: (column: SortableColumn) => void;
  updateFlight: (id: string, updates: Partial<Flight>) => void;
  addFlight: (flight: Flight) => void;
  removeFlight: (id: string) => void;
  resetFlights: (flights: Flight[]) => void;
}

export const useFlightsStore = create<FlightsStore>((set) => ({
  flights: [],
  filters: {
    terminal: 'All',
    airline: 'All',
    status: 'All',
    destination: '',
  },
  sort: { column: null, direction: 'asc' },

  setFlights: (flights) => set({ flights }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setSort: (column) =>
    set((state) => {
      const { sort } = state;
      if (sort.column !== column) return { sort: { column, direction: 'asc' as const } };
      if (sort.direction === 'asc') return { sort: { column, direction: 'desc' as const } };
      return { sort: { column: null, direction: 'asc' as const } };
    }),

  updateFlight: (id, updates) =>
    set((state) => ({
      flights: state.flights.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  addFlight: (flight) => set((state) => ({ flights: [...state.flights, flight] })),

  removeFlight: (id) =>
    set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),

  resetFlights: (flights) => set({ flights }),
}));

export function selectFilteredFlights(state: FlightsStore): Flight[] {
  const { flights, filters, sort } = state;
  const filtered = flights.filter((f) => {
    if (filters.terminal !== 'All' && f.terminal !== filters.terminal) return false;
    if (filters.airline !== 'All' && f.airline !== filters.airline) return false;
    if (filters.status !== 'All' && f.status !== filters.status) return false;
    if (filters.destination !== '' && !f.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
    return true;
  });

  if (sort.column === null) return filtered;

  const m = sort.direction === 'asc' ? 1 : -1;
  return [...filtered].sort((a, b) => {
    if (sort.column === 'status') {
      return (STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]) * m;
    }
    const aVal = a[sort.column!];
    const bVal = b[sort.column!];
    return aVal < bVal ? -m : aVal > bVal ? m : 0;
  });
}
