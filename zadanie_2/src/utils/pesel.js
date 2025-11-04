

export function validatePesel(pesel) {
    if (typeof pesel !== 'string') {
        return { valid: false, error: 'PESEL musi być łańcuchem znaków' };
    }

    const raw = pesel.trim();
    if (!/^[0-9]{11}$/.test(raw)) {
        return { valid: false, error: 'PESEL musi składać się z 11 cyfr' };
    }

    const digits = raw.split('').map((d) => parseInt(d, 10));

    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = digits
        .slice(0, 10)
        .reduce((acc, d, i) => acc + d * weights[i], 0);
    const control = (10 - (sum % 10)) % 10;
    if (control !== digits[10]) {
        return { valid: false, error: 'Nieprawidłowa suma kontrolna' };
    }

    const yy = parseInt(raw.slice(0, 2), 10);
    let mm = parseInt(raw.slice(2, 4), 10);
    const dd = parseInt(raw.slice(4, 6), 10);

    let year;
    if (mm >= 1 && mm <= 12) {
        year = 1900 + yy;
    } else if (mm >= 21 && mm <= 32) {
        year = 2000 + yy;
        mm -= 20;
    } else if (mm >= 41 && mm <= 52) {
        year = 2100 + yy;
        mm -= 40;
    } else if (mm >= 61 && mm <= 72) {
        year = 2200 + yy;
        mm -= 60;
    } else if (mm >= 81 && mm <= 92) {
        year = 1800 + yy;
        mm -= 80;
    } else {
        return { valid: false, error: 'Nieprawidłowa wartość miesiąca w PESEL' };
    }

    const date = new Date(Date.UTC(year, mm - 1, dd));
    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== mm ||
        date.getUTCDate() !== dd
    ) {
        return { valid: false, error: 'Nieprawidłowa data urodzenia w PESEL' };
    }

    const genderDigit = digits[9];
    const gender = genderDigit % 2 === 1 ? 'M' : 'F';

    const birthDate = `${year.toString().padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

    return { valid: true, birthDate, gender };
}