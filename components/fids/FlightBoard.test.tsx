import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { FlightBoard } from './FlightBoard';
import { useFlightsStore } from '@/store/flightsStore';
import type { Flight } from '@/types';

vi.mock('./LiveClock', () => ({
  LiveClock: () => <span>00:00</span>,
}));

const FLIGHTS: Flight[] = [
  {
    id: '1',
    flightNumber: 'LO123',
    airline: 'LOT',
    destination: 'Warsaw',
    departureTime: '08:00',
    terminal: 'T1',
    gate: 'A1',
    status: 'On Time',
  },
  {
    id: '2',
    flightNumber: 'FR456',
    airline: 'Ryanair',
    destination: 'London',
    departureTime: '09:30',
    terminal: 'T2',
    gate: 'B3',
    status: 'Departed',
  },
  {
    id: '3',
    flightNumber: 'W6789',
    airline: 'Wizz Air',
    destination: 'Budapest',
    departureTime: '11:00',
    terminal: 'T1',
    gate: 'C2',
    status: 'Delayed',
    delayMinutes: 30,
  },
];

beforeEach(() => {
  useFlightsStore.setState({
    flights: [],
    filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
    sort: { column: null, direction: 'asc' },
  });
});

// ---------------------------------------------------------------------------
// 1. Renderowanie listy lotów
// ---------------------------------------------------------------------------
describe('renderowanie listy lotów', () => {
  it('wyświetla numer lotu, destynację i godzinę każdego lotu', () => {
    render(<FlightBoard initialFlights={FLIGHTS} />);

    expect(screen.getByText('LO123')).toBeInTheDocument();
    expect(screen.getByText('Warsaw')).toBeInTheDocument();
    expect(screen.getByText('08:00')).toBeInTheDocument();

    expect(screen.getByText('FR456')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('09:30')).toBeInTheDocument();

    expect(screen.getByText('W6789')).toBeInTheDocument();
    expect(screen.getByText('Budapest')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
  });

  it('pokazuje licznik lotów', () => {
    render(<FlightBoard initialFlights={FLIGHTS} />);
    expect(screen.getByText('3 flights')).toBeInTheDocument();
  });

  it('używa formy liczby pojedynczej gdy jest jeden lot', () => {
    render(<FlightBoard initialFlights={[FLIGHTS[0]]} />);
    expect(screen.getByText('1 flight')).toBeInTheDocument();
  });

  it('wyświetla opóźnienie w minutach przy locie Delayed', () => {
    render(<FlightBoard initialFlights={FLIGHTS} />);
    expect(screen.getByText('+30m')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Filtrowanie po terminalu
// ---------------------------------------------------------------------------
describe('filtrowanie po terminalu', () => {
  it('po wyborze T1 pokazuje tylko loty z T1', async () => {
    const user = userEvent.setup();
    render(<FlightBoard initialFlights={FLIGHTS} />);

    const terminalSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(terminalSelect, 'T1');

    expect(screen.getByText('LO123')).toBeInTheDocument();  // T1
    expect(screen.getByText('W6789')).toBeInTheDocument();  // T1
    expect(screen.queryByText('FR456')).not.toBeInTheDocument(); // T2
    expect(screen.getByText('2 flights')).toBeInTheDocument();
  });

  it('po wyborze T2 pokazuje tylko loty z T2', async () => {
    const user = userEvent.setup();
    render(<FlightBoard initialFlights={FLIGHTS} />);

    const terminalSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(terminalSelect, 'T2');

    expect(screen.getByText('FR456')).toBeInTheDocument();   // T2
    expect(screen.queryByText('LO123')).not.toBeInTheDocument(); // T1
    expect(screen.queryByText('W6789')).not.toBeInTheDocument(); // T1
    expect(screen.getByText('1 flight')).toBeInTheDocument();
  });

  it('powrót do All Terminals przywraca wszystkie loty', async () => {
    const user = userEvent.setup();
    render(<FlightBoard initialFlights={FLIGHTS} />);

    const terminalSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(terminalSelect, 'T1');
    await user.selectOptions(terminalSelect, 'All');

    expect(screen.getByText('3 flights')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Pusty stan
// ---------------------------------------------------------------------------
describe('pusty stan', () => {
  it('wyświetla komunikat gdy nie ma żadnych lotów', () => {
    render(<FlightBoard initialFlights={[]} />);
    expect(screen.getByText('No flights match the current filters.')).toBeInTheDocument();
  });

  it('pokazuje 0 flights w liczniku', () => {
    render(<FlightBoard initialFlights={[]} />);
    expect(screen.getByText('0 flights')).toBeInTheDocument();
  });

  it('wyświetla pusty stan gdy filtr terminalu nie pasuje do żadnego lotu', async () => {
    const user = userEvent.setup();
    const onlyT1: Flight[] = FLIGHTS.filter((f) => f.terminal === 'T1');
    render(<FlightBoard initialFlights={onlyT1} />);

    const terminalSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(terminalSelect, 'T2');

    expect(screen.getByText('No flights match the current filters.')).toBeInTheDocument();
    expect(screen.getByText('0 flights')).toBeInTheDocument();
  });
});
