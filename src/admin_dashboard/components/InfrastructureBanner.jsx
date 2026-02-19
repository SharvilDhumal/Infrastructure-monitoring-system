import React from "react";
import bannerImage from "../images/Bannerimg.jpg";
import "./InfrastructureBanner.css";

const InfrastructureBanner = () => {
  return (
    <section className="infrastructure-banner">
      <img
        src={bannerImage}
        alt="Infrastructure Monitoring"
        className="banner-image"
      />
    </section>
  );
};

export default InfrastructureBanner;
