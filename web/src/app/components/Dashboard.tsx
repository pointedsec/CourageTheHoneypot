"use client";
import { toast } from "react-toastify";
import { useEffect } from "react";
import LoggedLayout from "../layouts/LoggedLayout";

export default function Dashboard({
  username,
  msg,
}: {
  username: string;
  msg: string;
}) {
    useEffect(() => {
        if (msg === "success") {
            toast("Bienvenido a Si, Soy Honeypot " + username, {
                position: "top-right",
                theme: "dark",
            });
        }
    }, [msg]);
  return (
    <LoggedLayout>
        Hola
    </LoggedLayout>
  );
}
