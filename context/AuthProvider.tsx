import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthUser = {
  id: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // inicijalno učitavanje usera + listener
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        const u = data.user;

        // ako nema potvrđen email → nemoj ga tretirati kao logovanog
        if (!u.email_confirmed_at) {
          setUser(null);
        } else {
          setUser({
            id: u.id,
            email: u.email ?? "",
          });
        }
      }
      setLoading(false);
    };

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const u = session?.user;

        // SIGNED_OUT → uvek ga skloni
        if (event === "SIGNED_OUT" || !session || !u) {
          setUser(null);
          return;
        }

        // ako user još nema potvrđen email, ignorišemo event
        if (!u.email_confirmed_at) {
          // dodatni safety: odjavi ga da ne ostane “napola” ulogovan
          supabase.auth.signOut();
          setUser(null);
          return;
        }

        // potvrđen user → normalno ga setujemo
        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          setUser({
            id: u.id,
            email: u.email ?? "",
          });
        }
      }
    );

    init();

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Neuspela prijava.");
    }

    setUser({
      id: data.user.id,
      email: data.user.email ?? "",
    });
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Neuspela registracija.");
    }

    // NE radimo setUser ovde
    // Ako baš želiš dodatni safety:
    await supabase.auth.signOut();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
