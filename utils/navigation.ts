// utils/navigation.ts
import { router } from "expo-router";

export async function replaceWithRetry(path: string, maxAttempts = 10, delay = 150) {
  let attempts = 0;

  const attempt = async (): Promise<void> => {
    try {
      // cast para any para evitar erro de tipagem do expo-router
      await (router.replace as any)(path);
    } catch (err) {
      attempts += 1;
      if (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, delay));
        return attempt();
      } else {
        console.warn("replaceWithRetry: failed to navigate", err);
      }
    }
  };

  return attempt();
}
