export default interface SessionRepository {

  createSession(
    dateHeureDebut: Date,
    duree: number,
    nombreKartsDisponibles: number,
    prix: number
  ): Promise<{
      ok: boolean;
  }>;

}