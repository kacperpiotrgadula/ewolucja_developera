import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightsStore, selectFilteredFlights } from './flightsStore';
import type { Flight } from '@/types';

// Mock flight data
const mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'LO123',
    airline: 'LOT',
    destination: 'Berlin',
    departureTime: '10:30',
    terminal: 'T1',
    gate: 'A1',
    status: 'On Time',
  },
  {
    id: '2',
    flightNumber: 'FR456',
    airline: 'Ryanair',
    destination: 'London',
    departureTime: '11:00',
    terminal: 'T2',
    gate: 'B2',
    status: 'Boarding',
  },
  {
    id: '3',
    flightNumber: 'LH789',
    airline: 'Lufthansa',
    destination: 'Munich',
    departureTime: '09:15',
    terminal: 'T1',
    gate: 'A3',
    status: 'Delayed',
    delayMinutes: 30,
  },
  {
    id: '4',
    flightNumber: 'W9000',
    airline: 'Wizz Air',
    destination: 'warsaw',
    departureTime: '14:00',
    terminal: 'T2',
    gate: 'C1',
    status: 'Departed',
  },
];

describe('selectFilteredFlights', () => {
  describe('Filtrowanie po terminalu', () => {
    it('powinno zwrócić loty z wybranego terminalu T1', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'T1', airline: 'All', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.terminal === 'T1')).toBe(true);
    });

    it('powinno zwrócić loty z terminalu T2 gdy wybrany T2', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'T2', airline: 'All', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.terminal === 'T2')).toBe(true);
    });

    it('powinno zwrócić wszystkie loty gdy terminal = "All"', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(4);
    });
  });

  describe('Filtrowanie po linii lotniczej', () => {
    it('powinno zwrócić loty LOT', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'LOT', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].airline).toBe('LOT');
    });

    it('powinno zwrócić puste gdy linia lotnicza nie istnieje', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'NonExistent', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(0);
    });
  });

  describe('Filtrowanie po statusie', () => {
    it('powinno zwrócić loty ze statusem "Boarding"', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'Boarding', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('Boarding');
    });

    it('powinno zwrócić loty ze statusem "Delayed"', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'Delayed', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('Delayed');
    });
  });

  describe('Filtrowanie po celu podróży', () => {
    it('powinno znaleźć lot po dokładnym celu', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: 'Berlin' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].destination).toBe('Berlin');
    });

    it('powinno znaleźć lot niezależnie od wielkości liter', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: 'WARSAW' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].destination.toLowerCase()).toBe('warsaw');
    });

    it('powinno znaleźć lot po części celu', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: 'Ber' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
    });

    it('powinno zwrócić puste gdy cel nie istnieje', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: 'NonExistent' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(0);
    });
  });

  describe('Sortowanie po statusie', () => {
    it('powinno sortować rosnąco: Boarding < Delayed < On Time < Departed < Cancelled', () => {
      const flights: Flight[] = [
        { ...mockFlights[0], status: 'On Time' },
        { ...mockFlights[1], status: 'Boarding' },
        { ...mockFlights[2], status: 'Delayed' },
        { ...mockFlights[3], status: 'Departed' },
        { id: '5', flightNumber: 'XX000', airline: 'LOT', destination: 'Test', departureTime: '15:00', terminal: 'T1', gate: 'A', status: 'Cancelled' },
      ];
      const state = {
        flights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'status' as const, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result[0].status).toBe('Boarding');
      expect(result[1].status).toBe('Delayed');
      expect(result[2].status).toBe('On Time');
      expect(result[3].status).toBe('Departed');
      expect(result[4].status).toBe('Cancelled');
    });

    it('powinno sortować malejąco status', () => {
      const flights: Flight[] = [
        { ...mockFlights[0], status: 'On Time' },
        { ...mockFlights[1], status: 'Boarding' },
        { ...mockFlights[2], status: 'Delayed' },
        { ...mockFlights[3], status: 'Departed' },
      ];
      const state = {
        flights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'status' as const, direction: 'desc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result[0].status).toBe('Departed');
      expect(result[1].status).toBe('On Time');
      expect(result[2].status).toBe('Delayed');
      expect(result[3].status).toBe('Boarding');
    });
  });

  describe('Sortowanie po godzinie wylotu', () => {
    it('powinno sortować rosnąco po departureTime', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'departureTime' as const, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result[0].departureTime).toBe('09:15');
      expect(result[1].departureTime).toBe('10:30');
      expect(result[2].departureTime).toBe('11:00');
      expect(result[3].departureTime).toBe('14:00');
    });

    it('powinno sortować malejąco po departureTime', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'departureTime' as const, direction: 'desc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result[0].departureTime).toBe('14:00');
      expect(result[3].departureTime).toBe('09:15');
    });
  });

  describe('Kombinacje filtrów i sortowania', () => {
    it('powinno filtrować i sortować jednocześnie', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'T1', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'departureTime' as const, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(2);
      expect(result[0].departureTime).toBe('09:15');
      expect(result[1].departureTime).toBe('10:30');
    });

    it('powinno obsługiwać wiele filtrów naraz', () => {
      const state = {
        flights: mockFlights,
        filters: { terminal: 'T1', airline: 'LOT', status: 'On Time', destination: 'Berlin' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('Edge cases', () => {
    it('powinno zwrócić puste gdy brak lotów', () => {
      const state = {
        flights: [],
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: null, direction: 'asc' as const },
      };
      const result = selectFilteredFlights(state);
      expect(result).toHaveLength(0);
    });

    it('powinno nie zmienić oryginalnego arraya gdy sortuje', () => {
      const flights = [...mockFlights];
      const state = {
        flights,
        filters: { terminal: 'All', airline: 'All', status: 'All', destination: '' },
        sort: { column: 'departureTime' as const, direction: 'asc' as const },
      };
      selectFilteredFlights(state);
      expect(flights[0].id).toBe('1');
    });
  });
});

describe('useFlightsStore - akcje', () => {
  beforeEach(() => {
    // Reset store przed każdym testem
    const store = useFlightsStore();
    store.resetFlights([]);
  });

  describe('setFlights', () => {
    it('powinno ustawić loty w store', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      expect(store.flights).toEqual(mockFlights);
    });

    it('powinno zastąpić istniejące loty nowymi', () => {
      const store = useFlightsStore();
      store.setFlights([mockFlights[0]]);
      expect(store.flights).toHaveLength(1);
      store.setFlights(mockFlights);
      expect(store.flights).toHaveLength(4);
    });

    it('powinno ustawić puste loty', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.setFlights([]);
      expect(store.flights).toHaveLength(0);
    });
  });

  describe('setFilter', () => {
    it('powinno zmienić filtr terminal', () => {
      const store = useFlightsStore();
      store.setFilter('terminal', 'T1');
      expect(store.filters.terminal).toBe('T1');
    });

    it('powinno zmienić filtr airline', () => {
      const store = useFlightsStore();
      store.setFilter('airline', 'LOT');
      expect(store.filters.airline).toBe('LOT');
    });

    it('powinno zmienić filtr status', () => {
      const store = useFlightsStore();
      store.setFilter('status', 'Boarding');
      expect(store.filters.status).toBe('Boarding');
    });

    it('powinno zmienić filtr destination', () => {
      const store = useFlightsStore();
      store.setFilter('destination', 'Berlin');
      expect(store.filters.destination).toBe('Berlin');
    });

    it('powinno zmienić wiele filtrów niezależnie', () => {
      const store = useFlightsStore();
      store.setFilter('terminal', 'T2');
      store.setFilter('airline', 'Ryanair');
      expect(store.filters.terminal).toBe('T2');
      expect(store.filters.airline).toBe('Ryanair');
    });
  });

  describe('setSort', () => {
    it('powinno ustawić sortowanie po nowej kolumnie', () => {
      const store = useFlightsStore();
      store.setSort('departureTime');
      expect(store.sort.column).toBe('departureTime');
      expect(store.sort.direction).toBe('asc');
    });

    it('powinno odwrócić kierunek sortowania na tej samej kolumnie', () => {
      const store = useFlightsStore();
      store.setSort('status');
      expect(store.sort.direction).toBe('asc');
      store.setSort('status');
      expect(store.sort.direction).toBe('desc');
    });

    it('powinno resetować sortowanie trzecim kliknięciem', () => {
      const store = useFlightsStore();
      store.setSort('terminal');
      store.setSort('terminal');
      store.setSort('terminal');
      expect(store.sort.column).toBeNull();
      expect(store.sort.direction).toBe('asc');
    });

    it('powinno resetować kierunek na asc przy zmianie kolumny', () => {
      const store = useFlightsStore();
      store.setSort('departureTime');
      store.setSort('departureTime');
      expect(store.sort.direction).toBe('desc');
      store.setSort('status');
      expect(store.sort.direction).toBe('asc');
    });
  });

  describe('updateFlight', () => {
    it('powinno zmienić dane istniejącego lotu', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.updateFlight('1', { status: 'Departed' });
      const flight = store.flights.find((f) => f.id === '1');
      expect(flight?.status).toBe('Departed');
    });

    it('powinno aktualizować częściowo (nie usuwać pozostałych pól)', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.updateFlight('2', { gate: 'B99' });
      const flight = store.flights.find((f) => f.id === '2');
      expect(flight?.gate).toBe('B99');
      expect(flight?.airline).toBe('Ryanair');
    });

    it('powinno ignorować update nieistniejącego lotu', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.updateFlight('999', { status: 'Departed' });
      expect(store.flights).toHaveLength(4);
    });

    it('powinno dodać delayMinutes przy statusie Delayed', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.updateFlight('1', { status: 'Delayed', delayMinutes: 45 });
      const flight = store.flights.find((f) => f.id === '1');
      expect(flight?.delayMinutes).toBe(45);
    });
  });

  describe('addFlight', () => {
    it('powinno dodać nowy lot do store', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      const newFlight: Flight = {
        id: '5',
        flightNumber: 'TEST001',
        airline: 'LOT',
        destination: 'Paris',
        departureTime: '12:00',
        terminal: 'T1',
        gate: 'A5',
        status: 'On Time',
      };
      store.addFlight(newFlight);
      expect(store.flights).toHaveLength(5);
      expect(store.flights[4]).toEqual(newFlight);
    });

    it('powinno dodać lot do pustego store', () => {
      const store = useFlightsStore();
      const flight: Flight = mockFlights[0];
      store.addFlight(flight);
      expect(store.flights).toHaveLength(1);
      expect(store.flights[0]).toEqual(flight);
    });

    it('powinno zachować kolejność lotów', () => {
      const store = useFlightsStore();
      store.addFlight(mockFlights[0]);
      store.addFlight(mockFlights[1]);
      store.addFlight(mockFlights[2]);
      expect(store.flights[0].id).toBe('1');
      expect(store.flights[1].id).toBe('2');
      expect(store.flights[2].id).toBe('3');
    });
  });

  describe('removeFlight', () => {
    it('powinno usunąć lot z store', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.removeFlight('1');
      expect(store.flights).toHaveLength(3);
      expect(store.flights.some((f) => f.id === '1')).toBe(false);
    });

    it('powinno ignorować usunięcie nieistniejącego lotu', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.removeFlight('999');
      expect(store.flights).toHaveLength(4);
    });

    it('powinno usunąć ostatni lot', () => {
      const store = useFlightsStore();
      store.addFlight(mockFlights[0]);
      store.removeFlight('1');
      expect(store.flights).toHaveLength(0);
    });
  });

  describe('resetFlights', () => {
    it('powinno zresetować loty do nowych wartości', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.resetFlights([mockFlights[0]]);
      expect(store.flights).toHaveLength(1);
      expect(store.flights[0]).toEqual(mockFlights[0]);
    });

    it('powinno zresetować do pustych lotów', () => {
      const store = useFlightsStore();
      store.setFlights(mockFlights);
      store.resetFlights([]);
      expect(store.flights).toHaveLength(0);
    });
  });

  describe('Stan początkowy store', () => {
    it('powinno mieć puste loty na start', () => {
      const store = useFlightsStore();
      expect(store.flights).toHaveLength(0);
    });

    it('powinno mieć filtr All dla wszystkich kategorii', () => {
      const store = useFlightsStore();
      expect(store.filters.terminal).toBe('All');
      expect(store.filters.airline).toBe('All');
      expect(store.filters.status).toBe('All');
      expect(store.filters.destination).toBe('');
    });

    it('powinno mieć brak sortowania na start', () => {
      const store = useFlightsStore();
      expect(store.sort.column).toBeNull();
      expect(store.sort.direction).toBe('asc');
    });
  });
});
