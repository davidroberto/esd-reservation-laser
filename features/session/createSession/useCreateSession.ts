import {useState} from "react";

import {fakeFetch} from "@/features/shared/fetch";

type CreateSessionCommand = {
  dateHeureDebut: Date;
  duree: number;
  nombreKartsDisponibles: number;
  prix: number;
}



export function useCreateSession() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createSession = async (command: CreateSessionCommand) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const now = new Date();
      if (command.dateHeureDebut <= now) {
        throw new Error("La date/heure doit être future");
      }

      if (command.prix <= 0) {
        throw new Error("Le prix doit être strictement supérieur à zéro");
      }

      if (command.nombreKartsDisponibles <= 0) {
        throw new Error("Le nombre de karts doit être strictement supérieur à zéro");
      }

      if (command.nombreKartsDisponibles > 10) {
        throw new Error("Le nombre de karts ne peut pas dépasser 10");
      }

      const fetchResponse = await fakeFetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      })

      if (!fetchResponse.ok) {
        throw new Error("Erreur lors de la création de la session");
      }

      setIsSuccess(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSession,
    error,
    isLoading,
    isSuccess,
  };
}
