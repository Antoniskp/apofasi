import AuthButtons from "../components/AuthButtons.jsx";

const authCopy = {
  hero: {
    pill: "Σύνδεση & Εγγραφή",
    title: "Συνδεθείτε για να αποθηκεύετε προτιμήσεις",
    body: "Χρησιμοποιούμε ασφαλή cookie συνεδρίας. Οι πάροχοι θα ενεργοποιηθούν μόλις προστεθούν τα κλειδιά OAuth στον server."
  }
};

export default function Auth() {
  return (
    <div className="section narrow">
      <p className="pill">{authCopy.hero.pill}</p>
      <h1 className="section-title">{authCopy.hero.title}</h1>
      <p className="muted">{authCopy.hero.body}</p>
      <div className="spacer" />
      <AuthButtons />
    </div>
  );
}
