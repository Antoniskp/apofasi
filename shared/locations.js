export const REGIONAL_LOCATIONS = [
  {
    region: "Αττική",
    citiesOrVillages: ["Αθήνα", "Πειραιάς", "Μαρούσι", "Γλυφάδα", "Περιστέρι"],
  },
  {
    region: "Κεντρική Μακεδονία",
    citiesOrVillages: ["Θεσσαλονίκη", "Κατερίνη", "Σέρρες", "Βέροια", "Έδεσσα"],
  },
  {
    region: "Δυτική Μακεδονία",
    citiesOrVillages: ["Κοζάνη", "Καστοριά", "Φλώρινα", "Γρεβενά"],
  },
  {
    region: "Ανατολική Μακεδονία και Θράκη",
    citiesOrVillages: ["Καβάλα", "Ξάνθη", "Δράμα", "Κομοτηνή", "Αλεξανδρούπολη"],
  },
  {
    region: "Ήπειρος",
    citiesOrVillages: ["Ιωάννινα", "Άρτα", "Πρέβεζα", "Ηγουμενίτσα", "Μέτσοβο"],
  },
  {
    region: "Θεσσαλία",
    citiesOrVillages: ["Λάρισα", "Βόλος", "Καρδίτσα", "Τρίκαλα", "Ελασσόνα"],
  },
  {
    region: "Ιόνιοι Νήσοι",
    citiesOrVillages: ["Κέρκυρα", "Ζάκυνθος", "Κεφαλονιά", "Λευκάδα", "Παξοί"],
  },
  {
    region: "Δυτική Ελλάδα",
    citiesOrVillages: ["Πάτρα", "Αγρίνιο", "Πύργος", "Αίγιο", "Μεσολόγγι"],
  },
  {
    region: "Στερεά Ελλάδα",
    citiesOrVillages: ["Λαμία", "Χαλκίδα", "Άμφισσα", "Θήβα", "Καρπενήσι"],
  },
  {
    region: "Πελοπόννησος",
    citiesOrVillages: ["Τρίπολη", "Καλαμάτα", "Σπάρτη", "Κόρινθος", "Ναύπλιο"],
  },
  {
    region: "Κρήτη",
    citiesOrVillages: ["Ηράκλειο", "Χανιά", "Ρέθυμνο", "Άγιος Νικόλαος", "Σητεία"],
  },
  {
    region: "Βόρειο Αιγαίο",
    citiesOrVillages: ["Μυτιλήνη", "Χίος", "Λήμνος", "Σάμος", "Ικαρία"],
  },
  {
    region: "Νότιο Αιγαίο",
    citiesOrVillages: ["Ρόδος", "Σύρος", "Κως", "Κάλυμνος", "Πάρος"],
  },
];

export const REGION_NAMES = REGIONAL_LOCATIONS.map((entry) => entry.region);

export const CITIES_BY_REGION = Object.fromEntries(
  REGIONAL_LOCATIONS.map((entry) => [entry.region, entry.citiesOrVillages])
);
