import SessionRepository from "@/features/session/SessionRepository";

export default class FakeSessionRepository implements SessionRepository {
  async createSession(
    dateHeureDebut: Date,
    duree: number,
    nombreKartsDisponibles: number,
    prix: number
  ): Promise<{
      ok: boolean;
  }> {

    setTimeout(() => {
        return;
    }, 2000);

    return { ok: true };
  }
}