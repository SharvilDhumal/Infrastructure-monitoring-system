// src/App.jsx
import React from "react";
import ReportFormPage from "./issueForm/form.jsx";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="p-4">
        <div className="container">
          <ReportFormPage />
        </div>
      </div>
    </div>
  );
};

export default App;
