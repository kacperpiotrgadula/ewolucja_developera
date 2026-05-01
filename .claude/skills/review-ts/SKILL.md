---
name: review-ts
description: Użyj tej umiejętności, gdy użytkownik prosi o sprawdzenie składni TypeScript, weryfikację zgodności ze standardami lub code review z fokusem na błędy typów i najnowsze standardy TypeScript — wklejonego bezpośrednio lub wskazanego przez ścieżkę pliku. Wyzwalacze to m.in. „sprawdź TypeScript", „review TypeScript", „weryfikuj ts", „znaj błędy typów", „check syntax", a także każda prośba o audit techniczny plików .ts/.tsx.
---

Przeprowadź szczegółową weryfikację pliku TypeScript zgodnie z najnowszymi standardami.

**Proces:**
1. Pobierz najnowszą dokumentację TypeScript z context7
2. Przeanalizuj kod pod kątem wszystkich niepoprawności
3. Zweryfikuj zgodność ze strict mode (tsconfig.json)

**Sprawdź:**
1. **Typy i typowanie** - brakujące type annotations, any, unknown, unsafe generics
2. **Strict Mode** - strictNullChecks, strictFunctionTypes, noImplicitAny
3. **ES Module syntax** - import/export (nigdy CommonJS require)
4. **Path aliases** - użycie @/types, @/store, @/lib, @/components
5. **Konwencje** - const over let/var, destructuring, naming conventions
6. **Błędy Runtime** - potencjalne null/undefined errors, type narrowing
7. **Best Practices** - zgodność z najnowszymi standardami TypeScript
8. **Bezpieczeństwo** - walidacja danych, type guards

**Format odpowiedzi:**
- Dla każdego problemu: poziom (blocker/warning/suggestion), opis, lokalizacja (linia), sugestia naprawy
- Jeśli kod jest poprawny - powiedz wprost i wyjaśnij dlaczego
- Podsumuj ilość znalezionych błędów po typach
