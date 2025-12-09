import { useState } from "react";

interface BookingData {
  nom: string;
  prenom: string;
  email: string;
  heureDebut: string;
  heureFin: string;
  nombrePersonnes: string;
}

export function useBookSession() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bookSession = async (data: BookingData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("https://votre-api.com/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la réservation");
      }

      const result = await response.json();
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookSession,
    error,
    isLoading,
    isSuccess,
  };
}