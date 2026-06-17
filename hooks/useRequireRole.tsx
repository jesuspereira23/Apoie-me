// src/hooks/useRequireRole.tsx
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { replaceWithRetry } from "../utils/navigation";

export function useRequireRole(expectedRole: "doador" | "orfanato") {
  const { userType, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    console.log("[useRequireRole] pathname:", pathname, "userType:", userType, "expected:", expectedRole);

    // whitelist baseada na sua estrutura de pastas
    const authWhitelist = [
      "/", 
      "/login",
      "/signup/orfanato",
      "/signup/doador",
      "/signup/login",
      "/(tabs)/signup",
      "/(tabs)/signup/orfanato",
      "/(tabs)/signup/doador",
      "/confirmacao-cadastro",
    ];

    if (!pathname) return;

    // se estiver em rota de auth/registro, não redireciona
    if (authWhitelist.some((p) => pathname.startsWith(p))) {
      console.log("[useRequireRole] rota na whitelist — sem redirect");
      return;
    }

    // espera curta para reduzir race condition com refresh do contexto
    const t = setTimeout(async () => {
      try {
        if (!userType) {
          console.warn("[useRequireRole] userType vazio — redirecionando para /");
          await replaceWithRetry("/", 10, 150);
          return;
        }
        if (userType !== expectedRole) {
          console.warn(`[useRequireRole] userType "${userType}" != esperado "${expectedRole}" — redirecionando para /`);
          await replaceWithRetry("/", 10, 150);
        }
      } catch (e) {
        console.warn("useRequireRole navigation error", e);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [userType, loading, expectedRole, pathname, router]);
}
