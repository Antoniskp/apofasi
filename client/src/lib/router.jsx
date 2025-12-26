import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext({ path: "/", navigate: () => {} });

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, "", to);
    setPath(to);
  };

  const value = useMemo(() => ({ path, navigate }), [path]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  let match = null;

  React.Children.forEach(children, (child) => {
    if (match || !React.isValidElement(child)) return;
    if (child.props.path === path) {
      match = child.props.element;
    }
  });

  if (!match) {
    React.Children.forEach(children, (child) => {
      if (match || !React.isValidElement(child)) return;
      if (child.props.path === "/") {
        match = child.props.element;
      }
    });
  }

  return match;
}

export function Route() {
  return null;
}

export function Link({ to, children, ...rest }) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (event) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
