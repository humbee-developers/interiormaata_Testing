"use client";
import React, { useEffect } from "react";
import Home from "@/app/Home/page";
const Page = () => {
  useEffect(() => {
    document.title = "Interiormaata-copy";
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
};

export default Page;
