// ============================================================
// 🚴 TOUR DE WILL – Zentrale Konfiguration
// ============================================================
// Hier alle Texte und Einstellungen anpassen!

export const CONFIG = {
  // ✏️ Geburtstagskarten-Text (wird von Malte geschrieben)
  birthdayMessage: `Lieber Willi,

wir wünschen dir alles Gute zum Geburtstag und heute eine wundervolle Feier. Du bist ein toller Mensch und wir sind dankbar, mit dir befreundet zu sein.

Dein Geschenk ist ein kleines Abenteuer. Vielleicht schaffst du ja Schritt für Schritt zu erraten, was passieren wird. Aber dafür brauchst du etwas Geschicklichkeit? Kannst du die Herausforderungen schaffen und das Rätsel lösen, bevor das Abenteuer beginnt?

Wir freuen uns riesig, mit dir ein gemeinsames Abenteuer zu erleben.

We love You ❤️`,

  // ✏️ Absender der Karte
  cardSenders: "Linda und Malte",

  // ✏️ Termine zur Auswahl
  termine: [
    { id: 1, label: "Freitag, 1. Mai", date: "2026-05-01" },
    { id: 2, label: "Samstag, 2. Mai", date: "2026-05-02" },
    { id: 3, label: "Sonntag, 3. Mai", date: "2026-05-03" },
    { id: 4, label: "Samstag, 9. Mai", date: "2026-05-09" },
    { id: 5, label: "Sonntag, 10. Mai", date: "2026-05-10" },
  ],

  // ✏️ Punktzahl für den Hinweis im Bike Runner
  bikeRunnerHintScore: 500,

  // ✏️ Hinweis-Text, der beim Bike Runner enthüllt wird
  bikeRunnerHintText: "Bring dein Fahrrad und gute Laune mit! 🚴",

  // ✏️ Game-Definitionen (Reihenfolge = Route)
  games: [
    { id: "bike-runner", title: "Bike Runner", description: "Weiche Hindernissen aus!", href: "/spiel/bike-runner" },
    { id: "reaktion", title: "Reaktionstest", description: "Wie schnell sind deine Reflexe?", href: "/spiel/reaktion" },
    { id: "game3", title: "???", description: "Bald verfügbar", href: "" },
    { id: "game4", title: "???", description: "Bald verfügbar", href: "" },
  ] as const,

  // ✏️ Teilnehmer
  players: ["Will", "Malte", "Linda", "Nicola"] as const,
};

export type PlayerName = (typeof CONFIG.players)[number];

// ============================================================
// Achievements
// ============================================================
export const ACHIEVEMENTS = [
  { id: "sternsammler", title: "Sternsammler", description: "10+ Sterne in einem Lauf", emoji: "⭐", game: "bike-runner" },
  { id: "unaufhaltsam", title: "Unaufhaltsam", description: "500+ Punkte im Bike Runner", emoji: "🛡️", game: "bike-runner" },
  { id: "kombo-koenig", title: "Kombo-König", description: "5x Combo-Streak", emoji: "🔥", game: "bike-runner" },
  { id: "marathon", title: "Marathon", description: "1000+ Punkte im Bike Runner", emoji: "🏅", game: "bike-runner" },
  { id: "geschwindigkeitsrausch", title: "Geschwindigkeitsrausch", description: "Reaktion-Durchschnitt unter 200ms", emoji: "⚡", game: "reaktion" },
  { id: "perfektionist", title: "Perfektionist", description: "800+ Punkte im Reaktionstest", emoji: "🏆", game: "reaktion" },
  { id: "blitzstart", title: "Blitzstart", description: "Eine Reaktion unter 150ms", emoji: "💨", game: "reaktion" },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];
