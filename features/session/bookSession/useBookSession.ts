import {useState} from "react";
import {fetchInterface} from "@/features/shared/fetch";

type BookSessionCommand = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nombreParticipants: number;
  sessionIds: number[];
};

export function useBookSession(fetchImplemention: fetchInterface) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bookSession = async (command: BookSessionCommand) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Validation: Nom requis
      if (!command.nom || command.nom.trim() === "") {
        throw new Error("Le nom est requis");
      }

      // Validation: Prénom requis
      if (!command.prenom || command.prenom.trim() === "") {
        throw new Error("Le prénom est requis");
      }

      // Validation: Email syntaxe correcte
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!command.email || !emailRegex.test(command.email)) {
        throw new Error("L'adresse email n'est pas valide");
      }

      // Validation: Téléphone 10 caractères (on enlève les espaces pour la validation)
      const telephoneSansEspaces = command.telephone.replace(/\s/g, "");
      if (telephoneSansEspaces.length !== 10) {
        throw new Error("Le numéro de téléphone doit contenir 10 caractères");
      }

      // Validation: Nombre de participants >= 1
      if (command.nombreParticipants < 1) {
        throw new Error(
          "Le nombre de participants doit être au minimum de 1"
        );
      }

      // Validation: Nombre de participants <= 10
      if (command.nombreParticipants > 10) {
        throw new Error(
          "Le nombre de participants doit être au maximum de 10"
        );
      }

      // Validation: Sessions sélectionnées (au moins 1)
      if (!command.sessionIds || command.sessionIds.length === 0) {
        throw new Error("Vous devez sélectionner au moins une session");
      }

      // Validation: Maximum 3 sessions
      if (command.sessionIds.length > 3) {
        throw new Error("Le nombre maximum de sessions autorisées est de 3");
      }

      // Appel API
      const fetchResponse = await fetchImplemention("https://fake-api-karting.fr/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: command.nom,
          prenom: command.prenom,
          email: command.email,
          telephone: telephoneSansEspaces,
          nombreParticipants: command.nombreParticipants,
          sessionIds: command.sessionIds,
        }),
      });

      if (!fetchResponse.ok) {
        throw new Error("Erreur lors de la création de la réservation");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { bookSession, error, isLoading, isSuccess };
}