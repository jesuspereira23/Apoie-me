// src/context/AuthContext.tsx
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type UserType = "doador" | "orfanato" | null;

interface AuthContextData {
  session: Session | null;
  userType: UserType;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserType(userId: string) {
    try {
      // tenta doador
      const { data: doador, error: doadorError } = await supabase
        .from("doadores")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (doadorError) throw doadorError;
      if (doador) {
        setUserType("doador");
        return;
      }

      // tenta orfanato
      const { data: orfanato, error: orfanatoError } = await supabase
        .from("orfanatos")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (orfanatoError) throw orfanatoError;
      if (orfanato) {
        setUserType("orfanato");
        return;
      }

      setUserType(null);
    } catch (e) {
      console.warn("loadUserType error:", e);
      setUserType(null);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      if (data.session?.user) {
        await loadUserType(data.session.user.id);
      } else {
        setUserType(null);
      }
    } catch (e) {
      console.warn("refresh auth session error:", e);
      setSession(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // inicial
    refresh();

    // listener de auth
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null);
      if (session?.user) {
        await loadUserType(session.user.id);
      } else {
        setUserType(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUserType(null);
  }

  return (
    <AuthContext.Provider value={{ session, userType, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
