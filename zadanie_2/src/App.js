import React, { useState } from 'react';
import { validatePesel } from './utils/pesel';
import './App.css';


export default function App() {
const [pesel, setPesel] = useState('');
const [result, setResult] = useState(null);


const handleCheck = () => {
const res = validatePesel(pesel);
setResult(res);
};


return (
<div style={{ padding: 20, fontFamily: 'Arial' }}>
<h2>Walidator PESEL</h2>
<p>Wprowadź numer PESEL (11 cyfr):</p>
<input
value={pesel}
onChange={(e) => setPesel(e.target.value)}
placeholder="np. 44051401458"
style={{ width: 240, fontSize: 16, padding: 6 }}
/>
<div style={{ marginTop: 10 }}>
<button onClick={handleCheck}>Sprawdź</button>
</div>


{result && (
<div style={{ marginTop: 16 }}>
{result.valid ? (
<div>
<strong>PESEL jest poprawny ✅</strong>
<div>Data urodzenia: {result.birthDate}</div>
<div>Płeć: {result.gender === 'M' ? 'mężczyzna' : 'kobieta'}</div>
</div>
) : (
<div>
<strong>PESEL niepoprawny ❌</strong>
<div>Błąd: {result.error}</div>
</div>
)}
</div>
)}
</div>
);
}