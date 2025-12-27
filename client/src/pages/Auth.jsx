import AuthButtons from "../components/AuthButtons.jsx";

export default function Auth() {
  return (
    <div className="section narrow">
      <p className="pill">Σύνδεση & Εγγραφή</p>
      <h1 className="section-title">Συνδεθείτε για να αποθηκεύετε προτιμήσεις</h1>
      <p className="muted">
        Χρησιμοποιούμε ασφαλή cookie συνεδρίας. Οι πάροχοι θα ενεργοποιηθούν μόλις προστεθούν τα
        κλειδιά OAuth στον server.
      </p>
      <div className="spacer" />
      <AuthButtons />
    </div>
  );
}
