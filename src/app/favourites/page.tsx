"use client";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites);
  return <div></div>;
}
