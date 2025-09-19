import { useState, useEffect } from "react";

export function useLanguage() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userLang") || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userLang", lang);
    }
  }, [lang]);

  return [lang, setLang] as const;
}
