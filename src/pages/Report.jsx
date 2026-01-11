import React from "react";
import Navbar from "../components/Navbar";
import ReportFormPage from "../issueForm/form";
import { Toaster } from "react-hot-toast";

const Report = () => {
  return (
    <>
      <div className="relative bg-black transition-colors min-h-screen pt-16 sm:pt-20">
        <Toaster />
        <Navbar />
        <div className="min-h-screen p-4">
          <div className="container mx-auto max-w-4xl">
            <ReportFormPage />
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
