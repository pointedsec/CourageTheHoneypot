"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import LoginForm from "../components/LoginForm";
import "../css/login.css";

export default function Home() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams?.get("msg");
    if (msg) {
      setMessage(msg);
    }
  }, [searchParams]);

  useEffect(() => {
    if (message === "error") {
      toast.error("❌ Credenciales incorrectas");
    }
  }, [message]);

  return (
    <div className="lines">
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <LoginForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
