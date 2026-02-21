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
    { id: "bike-runner", title: "Bike Runner", description: "Weiche Hindernissen aus!", href: "/spiel/bike-runner", week: 1 },
    { id: "reaktion", title: "Reaktionstest", description: "Wie schnell sind deine Reflexe?", href: "/spiel/reaktion", week: 2 },
    { id: "game3", title: "???", description: "Bald verfügbar", href: "", week: 3 },
    { id: "game4", title: "???", description: "Bald verfügbar", href: "", week: 4 },
  ] as const,

  // ✏️ Teilnehmer
  players: ["Will", "Malte", "Linda", "Nicola"] as const,
};

export type PlayerName = (typeof CONFIG.players)[number];
