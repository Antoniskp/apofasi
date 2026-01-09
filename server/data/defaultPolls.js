const defaultPolls = [
  {
    question: "Ποια είναι η σημαντικότερη προτεραιότητα για την περιοχή σου;",
    options: [
      { text: "Καθαριότητα και ανακύκλωση" },
      { text: "Υποδομές και έργα" },
      { text: "Ασφάλεια και φωτισμός" },
      { text: "Πράσινο και δημόσιοι χώροι" }
    ],
    tags: ["κοινότητα", "υποδομές"],
    region: "Αττική",
    cityOrVillage: "Αθήνα",
    isAnonymousCreator: true,
    anonymousResponses: true
  },
  {
    question: "Πόσο ικανοποιημένοι είστε από τις μετακινήσεις στην περιοχή σας;",
    options: [
      { text: "Πολύ ικανοποιημένος/η" },
      { text: "Αρκετά ικανοποιημένος/η" },
      { text: "Λίγο ικανοποιημένος/η" },
      { text: "Καθόλου ικανοποιημένος/η" }
    ],
    tags: ["μεταφορές", "καθημερινότητα"],
    region: "Θεσσαλονίκη",
    cityOrVillage: "Θεσσαλονίκη",
    isAnonymousCreator: true,
    anonymousResponses: true
  },
  {
    question: "Ποιες υπηρεσίες θέλετε να βελτιωθούν άμεσα;",
    options: [
      { text: "Υγεία" },
      { text: "Παιδεία" },
      { text: "Κοινωνική πρόνοια" },
      { text: "Δημοτική εξυπηρέτηση" }
    ],
    tags: ["υπηρεσίες", "κοινωνία"],
    region: "Κρήτη",
    cityOrVillage: "Ηράκλειο",
    isAnonymousCreator: true,
    anonymousResponses: true
  }
];

export default defaultPolls;
