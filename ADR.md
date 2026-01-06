# Architecture Decision Record - ESD Laser Reservation

## Date
Dernière mise à jour: 6 janvier 2026

## Statut
Living Document - À jour

---

## Vue d'ensemble du projet

Projet: **ESD Laser Reservation**
Framework: **React Native avec Expo SDK 54**
Langage: **TypeScript (strict mode)**
Architecture: **Vertical Slice Architecture**

---

## 1. Décisions d'architecture

### 1.1 Architecture globale: Vertical Slice Architecture

**Décision:** Organiser le code par fonctionnalités verticales plutôt que par couches techniques horizontales.

**Structure:**
```
/app                           # Couche présentation (Expo Router)
/features/{domain}/{useCase}   # Couche fonctionnelle (slices verticales)
  ├── {UseCase}Component.tsx   # Composant UI
  └── use{UseCase}.ts          # Logique métier (hook)
```

**Rationale:**
- Chaque fonctionnalité est autonome et facile à localiser
- Facilite la maintenance et l'évolution
- Réduit le couplage entre fonctionnalités
- Améliore la scalabilité du projet

**Exemple actuel:**
```
features/session/createSession/
├── CreateSessionComponent.tsx
└── useCreateSession.ts
```

### 1.2 Séparation des responsabilités

**Trois types de composants distincts:**

1. **Composants de page** (`/app`)
   - Responsabilité: Routing et layout uniquement
   - Délèguent toute la logique aux composants de feature
   - Exemples: `app/create-session.tsx`

2. **Composants de feature** (`features/*/Component.tsx`)
   - Responsabilité: Rendu UI et interaction utilisateur
   - Gèrent le state local du formulaire
   - Consomment les hooks pour la logique métier

3. **Hooks use case** (`features/*/use*.ts`)
   - Responsabilité: Logique métier, validation, appels API
   - Retournent état (loading, error, success) et fonctions d'action
   - Encapsulent toute la complexité business

### 1.3 Évolution: Abandon du Repository Pattern

**Décision:** Suppression de la couche repository (commit `f0ba9bc` - 6 jan 2026)

**Avant (approche avec abstraction):**
```typescript
// Interface repository
interface SessionRepository {
  createSession(...): Promise<{ok: boolean}>;
}

// Hook avec injection de dépendance
function useCreateSession(sessionRepository: SessionRepository) {
  await sessionRepository.createSession(...);
}
```

**Après (approche simplifiée):**
```typescript
// Hook avec appel direct
function useCreateSession() {
  const response = await fetch("https://fake-api-karting.fr", {...});
}
```

**Rationale:**
- La couche d'abstraction n'apportait pas de valeur suffisante au stade actuel
- Réduction de la complexité et du code boilerplate
- Approche pragmatique: ajouter l'abstraction quand elle devient nécessaire
- Plus simple à comprendre et maintenir

**Contexte:** Cette décision a été prise après avoir expérimenté avec le pattern (commit `1f77663` - 9 déc 2025). L'équipe a choisi de privilégier la simplicité.

---

## 2. Conventions de code

### 2.1 Conventions de nommage

#### Fichiers
- **Composants React:** `PascalCase.tsx`
  - Exemple: `CreateSessionComponent.tsx`
- **Hooks personnalisés:** `useCamelCase.ts`
  - Exemple: `useCreateSession.ts`
- **Routes (pages):** `kebab-case.tsx`
  - Exemple: `create-session.tsx`

#### Dossiers
- **Domaines:** `camelCase`
  - Exemple: `features/session/`
- **Use cases:** `camelCase`
  - Exemple: `features/session/createSession/`

#### Variables et types
- **Composants:** `PascalCase`
- **Hooks:** `camelCase` avec préfixe `use`
- **Types/Interfaces:** `PascalCase`
- **Variables:** `camelCase`
- **Constantes:** `UPPER_SNAKE_CASE` (si nécessaire)

#### Langue
**Convention importante:** Les termes métier sont en français
```typescript
type CreateSessionCommand = {
  dateHeureDebut: Date;
  duree: number;
  nombreKartsDisponibles: number;
  prix: number;
}
```

**Rationale:** Maintient le langage ubiquitaire du domaine métier

### 2.2 Organisation des imports

**Utilisation systématique des alias de chemin:**
```typescript
import { CreateSessionComponent } from "@/features/session/createSession/CreateSessionComponent";
```

**Configuration dans `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Type d'exports:**
- **Exports nommés:** Pour composants et hooks dans les features
  ```typescript
  export function CreateSessionComponent() {...}
  ```
- **Exports par défaut:** Pour les composants de page (requis par Expo Router)
  ```typescript
  export default function CreateSession() {...}
  ```

### 2.3 Structure des composants

**Ordre recommandé:**
```typescript
export function MyComponent() {
  // 1. Déclarations de state
  const [value, setValue] = useState("");

  // 2. Appels de hooks
  const { action, error, isLoading } = useMyHook();

  // 3. Handlers d'événements
  const handleSubmit = async () => {...};

  // 4. Render
  return (...);
}

// 5. StyleSheet à la fin
const styles = StyleSheet.create({...});
```

---

## 3. Patterns et bonnes pratiques

### 3.1 Pattern: Custom Hook Use Case

**Principe:** Encapsuler la logique métier dans des hooks React personnalisés

**Structure type:**
```typescript
export function useFeatureAction() {
  // État interne
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fonction d'action
  const performAction = async (command: ActionCommand) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Validation des règles métier
      if (/* règle violée */) {
        throw new Error("Message d'erreur");
      }

      // 2. Appel externe (API, etc.)
      const response = await fetch(...);

      if (!response.ok) {
        throw new Error("Erreur API");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, error, isLoading, isSuccess };
}
```

**Avantages:**
- Séparation claire entre UI et logique métier
- Réutilisabilité du code métier
- Testabilité (les hooks peuvent être testés indépendamment)
- Gestion centralisée des états (loading, error, success)

### 3.2 Pattern: Command Object

**Principe:** Utiliser des objets typés pour transférer des données vers les use cases

```typescript
type CreateSessionCommand = {
  dateHeureDebut: Date;
  duree: number;
  nombreKartsDisponibles: number;
  prix: number;
}

const { createSession } = useCreateSession();
await createSession(command);
```

**Avantages:**
- Type safety
- Contrat clair entre UI et logique métier
- Facilite la validation
- Documentation implicite des paramètres requis

### 3.3 Pattern: Gestion des erreurs

**Stratégie:**
1. **Validation métier:** Lancer des exceptions avec messages explicites
2. **Try-catch centralisé:** Dans chaque hook use case
3. **État d'erreur:** Retourné par le hook pour affichage UI
4. **Finally:** Toujours réinitialiser l'état de loading

**Exemple:**
```typescript
try {
  // Validations métier (throw si invalide)
  if (command.prix <= 0) {
    throw new Error("Le prix doit être strictement supérieur à zéro");
  }

  // Opérations externes
  const response = await fetch(...);

  if (!response.ok) {
    throw new Error("Erreur lors de la création");
  }

  setIsSuccess(true);
} catch (err) {
  setError(err instanceof Error ? err.message : "Une erreur est survenue");
  setIsSuccess(false);
} finally {
  setIsLoading(false);
}
```

**Affichage dans l'UI:**
```typescript
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

### 3.4 Gestion du state

**Approche actuelle:** State local avec `useState`

**Stratégie:**
- **State de formulaire:** Géré dans le composant UI
- **State de l'opération:** Géré dans le hook (loading, error, success)
- **Pas de state global** pour le moment (Redux, Zustand, etc.)

**Quand considérer un state global:**
- Partage de données entre plusieurs features
- Cache de données API
- Authentification utilisateur
- Préférences globales

### 3.5 Pattern: États UI basés sur les hooks

**Principe:** Les composants réagissent aux états retournés par les hooks

```typescript
const { createSession, error, isLoading, isSuccess } = useCreateSession();

// État de chargement
<TouchableOpacity
  disabled={isLoading}
  style={[styles.button, isLoading && styles.buttonDisabled]}
>
  {isLoading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text style={styles.buttonText}>Créer la session</Text>
  )}
</TouchableOpacity>

// État d'erreur
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}

// État de succès
{isSuccess && (
  <View style={styles.successContainer}>
    <Text style={styles.successText}>Opération réussie</Text>
  </View>
)}
```

---

## 4. Stack technique

### 4.1 Core

- **React:** `19.1.0`
- **React Native:** `0.81.5`
- **Expo SDK:** `~54.0.27`
- **TypeScript:** Avec `strict: true`

### 4.2 Navigation et routing

- **expo-router:** `~6.0.17` (routing basé sur les fichiers)
- **@react-navigation/native:** `^7.1.8`
- **@react-navigation/bottom-tabs:** `^7.4.0`

### 4.3 UI et animations

- **react-native-gesture-handler:** `~2.28.0`
- **react-native-reanimated:** `~4.1.1`
- **react-native-safe-area-context:** `~5.6.0`
- **react-native-screens:** `~4.16.0`

### 4.4 Outils de développement

- **ESLint:** `eslint-config-expo@~10.0.0`
- **TypeScript:** Configuration stricte

### 4.5 Configuration TypeScript

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Points clés:**
- Mode strict activé (meilleure sécurité de typage)
- Alias de chemin `@/*` pour imports absolus

### 4.6 Features Expo activées

**Dans `app.json`:**
- `"newArchEnabled": true` - Nouvelle architecture React Native
- `"typedRoutes": true` - Routes typées pour TypeScript
- `"reactCompiler": true` - Compilateur React (expérimental)

---

## 5. Règles de développement

### 5.1 Validation métier

**Règle:** Toute validation métier doit être faite dans le hook use case, pas dans le composant UI

**Exemple actuel (session karting):**
```typescript
// Dans useCreateSession.ts
if (command.dateHeureDebut <= now) {
  throw new Error("La date/heure doit être future");
}

if (command.prix <= 0) {
  throw new Error("Le prix doit être strictement supérieur à zéro");
}

if (command.nombreKartsDisponibles <= 0 || command.nombreKartsDisponibles > 10) {
  throw new Error("Le nombre de karts doit être entre 1 et 10");
}
```

**Rationale:**
- Centralise la logique métier
- Évite la duplication
- Facilite les tests

### 5.2 Appels API

**Règle actuelle:** Appels directs avec `fetch` dans les hooks

**Format:**
```typescript
const response = await fetch("URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

if (!response.ok) {
  throw new Error("Message d'erreur");
}
```

**Note:** Les URLs API sont actuellement en dur. Considérer une configuration par environnement à l'avenir.

### 5.3 Création de nouvelles features

**Process recommandé:**

1. **Créer la structure de dossiers:**
   ```
   features/{domain}/{useCase}/
   ```

2. **Créer le hook use case:**
   ```typescript
   // features/{domain}/{useCase}/use{UseCase}.ts
   export function useFeatureAction() {
     // État
     const [error, setError] = useState<string | null>(null);
     const [isLoading, setIsLoading] = useState(false);
     const [isSuccess, setIsSuccess] = useState(false);

     // Commande
     const action = async (command: ActionCommand) => {
       // Implémentation
     };

     return { action, error, isLoading, isSuccess };
   }
   ```

3. **Créer le composant UI:**
   ```typescript
   // features/{domain}/{useCase}/{UseCase}Component.tsx
   export function FeatureComponent() {
     const [formState, setFormState] = useState(...);
     const { action, error, isLoading } = useFeatureAction();

     const handleSubmit = async () => {
       await action({ ...formState });
     };

     return (...);
   }
   ```

4. **Créer la page (si nécessaire):**
   ```typescript
   // app/feature-page.tsx
   import { FeatureComponent } from "@/features/domain/useCase/FeatureComponent";

   export default function FeaturePage() {
     return <FeatureComponent />;
   }
   ```

### 5.4 Gestion des styles

**Règle:** Utiliser `StyleSheet.create()` à la fin de chaque fichier composant

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  // ...
});
```

**Avantages:**
- Performance (styles sont créés une seule fois)
- Validation des propriétés
- IntelliSense

---

## 6. Tests (À implémenter)

### 6.1 État actuel

**Aucun test n'est actuellement implémenté dans le projet.**

### 6.2 Recommandations futures

**Framework suggéré:**
- **Jest** - Test runner
- **React Native Testing Library** - Pour les composants
- **MSW (Mock Service Worker)** - Pour mocker les API

**Stratégie de test recommandée:**

1. **Tests unitaires des hooks:**
   ```typescript
   // useCreateSession.test.ts
   describe("useCreateSession", () => {
     it("should validate that price is positive", async () => {
       const { result } = renderHook(() => useCreateSession());
       await expect(
         result.current.createSession({ prix: -10, ... })
       ).rejects.toThrow("Le prix doit être strictement supérieur à zéro");
     });
   });
   ```

2. **Tests d'intégration des composants:**
   ```typescript
   // CreateSessionComponent.test.tsx
   describe("CreateSessionComponent", () => {
     it("should display error when API fails", async () => {
       // Test
     });
   });
   ```

3. **Tests E2E (optionnel):**
   - Detox ou Maestro pour React Native

---

## 7. Évolution historique

### Chronologie des décisions architecturales

#### Phase 1: Initialisation (9 décembre 2025)
**Commit `97ca22f`: "vertical slice + hook use case in react native"**
- Mise en place de l'architecture Vertical Slice
- Introduction du pattern hook = use case
- Structure initiale du projet

#### Phase 2: Expérimentation avec abstractions (9 décembre 2025)
**Commit `1f77663`: "inversion de dépendance pour le fetch dans le hook avec une interface"**
- Ajout du Repository Pattern
- Création d'interfaces pour l'abstraction
- Injection de dépendances dans les hooks
- Renommage `BookSession` → `CreateSession`

#### Phase 3: Simplification (6 janvier 2026)
**Commit `f0ba9bc`: "remove repo interface and repo implementation"**
- Suppression du Repository Pattern
- Retour aux appels `fetch` directs
- Approche pragmatique privilégiée

### Leçons apprises

1. **Itération architecturale:** L'équipe n'a pas peur d'expérimenter et de revenir en arrière
2. **Pragmatisme:** Préférence pour la simplicité sur la pureté architecturale
3. **YAGNI (You Aren't Gonna Need It):** Ne pas ajouter de complexité avant qu'elle soit nécessaire

---

## 8. Points forts du projet

1. **Architecture claire et cohérente**
   - Vertical Slice facilite la navigation
   - Séparation des responsabilités bien définie

2. **Conventions de nommage consistantes**
   - Facile de deviner où trouver le code
   - Standards clairs et appliqués

3. **Approche pragmatique**
   - Simplicité privilégiée
   - Refactoring quand nécessaire

4. **Stack moderne**
   - React Native nouvelle architecture
   - TypeScript strict
   - Expo SDK récent

5. **Langage ubiquitaire**
   - Termes métier en français
   - Alignement avec le domaine

---

## 9. Axes d'amélioration futurs

### 9.1 Court terme

1. **Tests**
   - Implémenter Jest et React Native Testing Library
   - Commencer par les hooks use case (plus simples à tester)

2. **Configuration API**
   - Externaliser les URLs d'API
   - Support multi-environnement (dev, staging, prod)

3. **Gestion des erreurs**
   - Créer des classes d'erreur personnalisées
   - Typer les erreurs selon leur nature

### 9.2 Moyen terme

4. **Validation de formulaires**
   - Évaluer une bibliothèque (Zod, Yup, React Hook Form)
   - Standardiser la validation côté UI

5. **Internationalisation (si nécessaire)**
   - react-native-i18n ou expo-localization
   - Séparer les messages d'erreur dans des fichiers de traduction

6. **CI/CD**
   - Tests automatisés
   - Builds automatiques
   - Linting et formatage (Prettier)

### 9.3 Long terme

7. **State management global**
   - Si nécessaire: Zustand ou Jotai (légers)
   - Éviter Redux sauf si vraiment nécessaire

8. **Monitoring et analytics**
   - Sentry pour les erreurs en production
   - Analytics (Firebase, Amplitude, etc.)

9. **Performance**
   - React.memo pour composants lourds
   - useMemo/useCallback si goulots identifiés
   - Lazy loading des features

---

## 10. Principes directeurs

### 10.1 Philosophie architecturale

1. **Simplicité d'abord**
   - Commencer simple, complexifier seulement si nécessaire
   - YAGNI (You Aren't Gonna Need It)

2. **Pragmatisme sur dogmatisme**
   - Les patterns sont des outils, pas des obligations
   - Choisir ce qui fonctionne pour le contexte

3. **Itération et adaptation**
   - Expérimenter, mesurer, ajuster
   - Ne pas avoir peur de revenir en arrière

4. **Maintenabilité**
   - Code lisible > Code clever
   - Conventions > Configuration

### 10.2 Critères de décision

Avant d'ajouter une abstraction ou un pattern, se poser ces questions:

1. **Apporte-t-elle de la valeur maintenant?**
   - Si non, ne pas l'ajouter

2. **Simplifie-t-elle le code ou le complexifie-t-elle?**
   - Si complexifie sans gain clair, éviter

3. **Est-elle testable?**
   - Privilégier les approches testables

4. **Est-elle compréhensible par toute l'équipe?**
   - Si trop abstraite, reconsidérer

---

## Références et ressources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Patterns et architecture
- Vertical Slice Architecture
- Custom Hooks Pattern (React)
- Command Pattern

### Articles pertinents
- [YAGNI Principle](https://martinfowler.com/bliki/Yagni.html)
- [Pragmatic Programmer](https://pragprog.com/)

---

## Changelog de ce document

- **6 janvier 2026:** Création initiale de l'ADR basée sur l'analyse du codebase