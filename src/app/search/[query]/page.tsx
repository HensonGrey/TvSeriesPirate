"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function page() {
  const { query } = useParams();
  return <div>{query}</div>;
}
