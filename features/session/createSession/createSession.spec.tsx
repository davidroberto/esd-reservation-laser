import {render, screen, fireEvent, waitFor} from '@testing-library/react-native'
import {CreateSessionComponent} from "./CreateSessionComponent";

jest.useFakeTimers();

test('admin: créer une session de karting OK', async () => {

    //Etant donné que je suis un administrateur authentifié
    // Quand je crée une session de karting avec les informations suivantes :
    // - Date et heure de début: 2099-07-01 14:00
    // - Durée : 30 minutes
    // - Nombre de karts disponibles : 10
    // - Prix : 20 euros
    render(<CreateSessionComponent />)

    fireEvent.changeText(screen.getByTestId('test-input-dateHeureDebut'), '2099-07-01 14:00');
    fireEvent.changeText(screen.getByTestId('test-input-duree'), '30');
    fireEvent.changeText(screen.getByTestId('test-input-nombreKartsDisponibles'), '10');
    fireEvent.changeText(screen.getByTestId('test-input-prix'), '20.00');

    fireEvent.press(screen.getByTestId('test-creer'))

    jest.advanceTimersByTime(1000);

    // Alors la session de karting est créée avec succès
    await waitFor(() => {
        expect(screen.getByText('Session créée avec succès')).toBeTruthy()
    })
})