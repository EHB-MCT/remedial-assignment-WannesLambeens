import { useState } from "react";

export default function AuthForm({ title, onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <label className="block mb-2">
        Naam:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
          placeholder="Voer je naam in"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        {title}
      </button>
    </form>
  );
}