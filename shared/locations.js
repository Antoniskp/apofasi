// Countries
export const COUNTRIES = [
  { value: "greece", label: "Ελλάδα" },
  { value: "international", label: "Διεθνές" },
];

// Greek jurisdictions (regions/prefectures)
export const GREEK_JURISDICTIONS = [
  {
    jurisdiction: "Αττική",
    citiesOrCommunities: ["Αθήνα", "Πειραιάς", "Μαρούσι", "Γλυφάδα", "Περιστέρι"],
  },
  {
    jurisdiction: "Κεντρική Μακεδονία",
    citiesOrCommunities: ["Θεσσαλονίκη", "Κατερίνη", "Σέρρες", "Βέροια", "Έδεσσα"],
  },
  {
    jurisdiction: "Δυτική Μακεδονία",
    citiesOrCommunities: ["Κοζάνη", "Καστοριά", "Φλώρινα", "Γρεβενά"],
  },
  {
    jurisdiction: "Ανατολική Μακεδονία και Θράκη",
    citiesOrCommunities: ["Καβάλα", "Ξάνθη", "Δράμα", "Κομοτηνή", "Αλεξανδρούπολη"],
  },
  {
    jurisdiction: "Ήπειρος",
    citiesOrCommunities: ["Ιωάννινα", "Άρτα", "Πρέβεζα", "Ηγουμενίτσα", "Μέτσοβο"],
  },
  {
    jurisdiction: "Θεσσαλία",
    citiesOrCommunities: ["Λάρισα", "Βόλος", "Καρδίτσα", "Τρίκαλα", "Ελασσόνα"],
  },
  {
    jurisdiction: "Ιόνιοι Νήσοι",
    citiesOrCommunities: ["Κέρκυρα", "Ζάκυνθος", "Κεφαλονιά", "Λευκάδα", "Παξοί"],
  },
  {
    jurisdiction: "Δυτική Ελλάδα",
    citiesOrCommunities: ["Πάτρα", "Αγρίνιο", "Πύργος", "Αίγιο", "Μεσολόγγι"],
  },
  {
    jurisdiction: "Στερεά Ελλάδα",
    citiesOrCommunities: ["Λαμία", "Χαλκίδα", "Άμφισσα", "Θήβα", "Καρπενήσι"],
  },
  {
    jurisdiction: "Πελοπόννησος",
    citiesOrCommunities: ["Τρίπολη", "Καλαμάτα", "Σπάρτη", "Κόρινθος", "Ναύπλιο"],
  },
  {
    jurisdiction: "Κρήτη",
    citiesOrCommunities: ["Ηράκλειο", "Χανιά", "Ρέθυμνο", "Άγιος Νικόλαος", "Σητεία"],
  },
  {
    jurisdiction: "Βόρειο Αιγαίο",
    citiesOrCommunities: ["Μυτιλήνη", "Χίος", "Λήμνος", "Σάμος", "Ικαρία"],
  },
  {
    jurisdiction: "Νότιο Αιγαίο",
    citiesOrCommunities: ["Ρόδος", "Σύρος", "Κως", "Κάλυμνος", "Πάρος"],
  },
];

export const GREEK_JURISDICTION_NAMES = GREEK_JURISDICTIONS.map((entry) => entry.jurisdiction);

export const CITIES_BY_JURISDICTION = Object.fromEntries(
  GREEK_JURISDICTIONS.map((entry) => [entry.jurisdiction, entry.citiesOrCommunities])
);

// Legacy exports for backward compatibility
export const REGIONAL_LOCATIONS = GREEK_JURISDICTIONS.map((j) => ({
  region: j.jurisdiction,
  citiesOrVillages: j.citiesOrCommunities,
}));

export const REGION_NAMES = GREEK_JURISDICTION_NAMES;

export const CITIES_BY_REGION = CITIES_BY_JURISDICTION;
