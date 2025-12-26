import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // This will show in server logs if you ever capture console output
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
          <h1 style={{ margin: 0 }}>Client error</h1>
          <p style={{ marginTop: 8 }}>
            The app crashed while rendering. The message is:
          </p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fff", padding: 12, borderRadius: 8 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
