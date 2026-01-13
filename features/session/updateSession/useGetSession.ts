import {useState, useEffect} from "react";

export type Session = {
  sessionId: string;
  dateHeureDebut: string;
  duree: number;
  nombreKartsDisponibles: number;
  prix: number;
}

export type GetSessionFetchInterface = {
  (url: string): Promise<{
    ok: boolean;
    data?: Session;
  }>;
}

export const fakeFetchGetSession: GetSessionFetchInterface = (url: string): Promise<{
  ok: boolean;
  data?: Session;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        data: {
          sessionId: "123",
          dateHeureDebut: "2025-06-15 14:00",
          duree: 45,
          nombreKartsDisponibles: 8,
          prix: 35.50,
        },
      });
    }, 500);
  });
}

export function useGetSession(sessionId: string, fetchImplementation: GetSessionFetchInterface) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchResponse = await fetchImplementation(`/api/sessions/${sessionId}`);

        if (!fetchResponse.ok) {
          throw new Error("Erreur lors de la récupération de la session");
        }

        if (fetchResponse.data) {
          setSession(fetchResponse.data);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, fetchImplementation]);

  return {
    session,
    error,
    isLoading,
  };
}
