import {useState} from "react";

import {fetchInterface} from "@/features/shared/fetch";

type UpdateSessionCommand = {
  sessionId: string;
  dateHeureDebut: Date;
  duree: number;
  nombreKartsDisponibles: number;
  prix: number;
}

// Etant donné que je suis connecté en tant que client
// quand j'ajoute 3 produits au panier
// alors que je dois recevoir une confirmation que les produits ont été ajoutés au panier

// Etant donné que je suis connecté en tant que client
// quand j'ajoute 5 produits au panier
// alors que je dois recevoir une erreur m'indiquant que je ne peux pas ajouter plus de 3 produits au panier


// => scenario de test unitaire (test d'acceptation)

// BACKEND
// test unitaire -> use case (règles métiers) -> fake repository (fausse données)


// FRONTEND
// test d'ui / integration -> composant -> hook (règles métiers) -> fake fetch (fausse données)



export function useUpdateSession(fetchImplementation: fetchInterface) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateSession = async (command: UpdateSessionCommand) => {
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

      const fetchResponse = await fetchImplementation(`/api/sessions/${command.sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateHeureDebut: command.dateHeureDebut,
          duree: command.duree,
          nombreKartsDisponibles: command.nombreKartsDisponibles,
          prix: command.prix,
        }),
      })

      if (!fetchResponse.ok) {
        throw new Error("Erreur lors de la modification de la session");
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
    updateSession,
    error,
    isLoading,
    isSuccess,
  };
}
