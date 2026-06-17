import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
  query: string;
  setQuery: (q: string) => void;
  categoria: string | null;
  setCategoria: (c: string | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);

  return (
    <SearchContext.Provider value={{ query, setQuery, categoria, setCategoria }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
