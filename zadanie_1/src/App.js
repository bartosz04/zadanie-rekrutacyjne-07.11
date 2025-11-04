import React, { useState } from "react";

function App() {
  const [output, setOutput] = useState("");

  const shuffleMiddle = (word) => {
    if (word.length <= 3) return word;

    const first = word[0];
    const last = word[word.length - 1];
    const middle = word.slice(1, -1).split("");

    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }

    return first + middle.join("") + last;
  };

  const processText = (text) => {
    return text.replace(/\p{L}+/gu, (word) => shuffleMiddle(word));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setOutput(processText(text));
    };
    reader.readAsText(file, "UTF-8");
  };

  const downloadResult = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wynik.txt";
    link.click();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Zadanie 1 </h2>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      
      <h3>Wynik:</h3>
      <textarea
        style={{ width: "100%", height: "200px" }}
        value={output}
        onChange={(e) => setOutput(e.target.value)}
      />

      {output && (
        <button style={{ marginTop: "10px" }} onClick={downloadResult}>
          Pobierz wynik
        </button>
      )}
    </div>
  );
}

export default App;
