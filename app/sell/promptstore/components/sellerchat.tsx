"use client";

import { useState } from "react";

export default function SellerChat() {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    const response = await fetch("/api/route-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    const data = await response.json();

    console.log("AI DATA:", data);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Generate
      </button>
    </div>
  );
}