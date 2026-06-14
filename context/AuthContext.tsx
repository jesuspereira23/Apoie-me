import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type UserType = 'doador' | 'orfanato' | null;

interface AuthContextData {
  session: Session | null;
  userType: UserType;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserType(userId: string) {
    const { data: doador } = await supabase
      .from('doadores')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (doador) {
      setUserType('doador');
      return;
    }

    const { data: orfanato } = await supabase
      .from('orfanatos')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (orfanato) {
      setUserType('orfanato');
      return;
    }

    setUserType(null);
  }

  useEffect(() => {
    // pega sessão atual
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        await loadUserType(data.session.user.id);
      }
      setLoading(false);
    });

    // escuta mudanças de auth (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
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
    <AuthContext.Provider value={{ session, userType, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}