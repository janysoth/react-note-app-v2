import React from "react";

function App() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to My React App
      </h1>
      <p className="text-blue-700 text-lg font-bold">
        Tailwind CSS is working perfectly!
      </p>
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Click Me
      </button>
    </div>
  );
}

export default App;