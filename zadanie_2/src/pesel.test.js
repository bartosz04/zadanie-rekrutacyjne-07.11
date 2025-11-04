import { validatePesel } from './utils/pesel';

describe('validatePesel', () => {
  test('poprawny przykładowy PESEL (44051401458)', () => {
    const res = validatePesel('44051401458');
    expect(res.valid).toBe(true);
    expect(res.birthDate).toBe('1944-05-14');
    expect(res.gender).toBe('M');
  });

  test('niepoprawna długość', () => {
    const res = validatePesel('12345');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/11 cyfr/);
  });

  test('niecyfrowe znaki', () => {
    const res = validatePesel('abcdefghijk');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/11 cyfr/);
  });

  test('nieprawidłowa suma kontrolna', () => {
    const res = validatePesel('44051401459');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/suma kontrolna/);
  });

  test('nieprawidłowa data (miesiąc poza zakresem)', () => {
    const res = validatePesel('99003112315');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/miesiąca/);
  });

  test('przestępny - poprawny PESEL dla 29.02.2000', () => {
    const res = validatePesel('00222900014');
    expect(res.valid).toBe(true);
    expect(res.birthDate).toBe('2000-02-29');
  });
});
