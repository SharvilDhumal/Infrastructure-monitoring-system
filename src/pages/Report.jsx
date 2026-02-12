import React from "react";
import Navbar from "../components/Navbar";
import ReportFormPage from "../issueForm/form";
import { Toaster } from "react-hot-toast";

const Report = () => {
  return (
    <div className="min-h-screen bg-[#05070a] selection:bg-blue-500/30">
      <Toaster position="top-center" />
      <Navbar />
      
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative pt-32 pb-20 px-6 sm:px-10">
        <div className="container mx-auto">
          <ReportFormPage />
        </div>
      </div>
    </div>
  );
};

export default Report;
