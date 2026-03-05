import React from "react";
import Navbar from "../components/landing-page/Navbar";
import ReportFormPage from "../issueForm/form";
import { Toaster } from "react-hot-toast";

const Report = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-500/30">
      <Toaster position="top-center" />
      <Navbar />


      <div className="relative pt-32 pb-20 px-6 sm:px-10">
        <div className="container mx-auto">
          <ReportFormPage />
        </div>
      </div>
    </div>
  );
};

export default Report;
