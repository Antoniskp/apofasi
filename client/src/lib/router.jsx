import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext({
  path: "/",
  navigate: () => {},
  params: {},
  setParams: () => {},
});

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname);
  const [params, setParams] = useState({});

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

  const value = useMemo(() => ({ path, navigate, params, setParams }), [path, params]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const { path, setParams } = useContext(RouterContext);

  const matchData = useMemo(() => {
    let match = null;
    let matchedParams = {};

    const tryMatch = (routePath, currentPath) => {
      if (routePath === currentPath) {
        return {};
      }

      const routeParts = routePath.split("/").filter(Boolean);
      const pathParts = currentPath.split("/").filter(Boolean);

      if (routeParts.length !== pathParts.length) {
        return null;
      }

      const paramsForRoute = {};

      for (let i = 0; i < routeParts.length; i += 1) {
        const routePart = routeParts[i];
        const pathPart = pathParts[i];

        if (routePart.startsWith(":")) {
          paramsForRoute[routePart.slice(1)] = pathPart;
        } else if (routePart !== pathPart) {
          return null;
        }
      }

      return paramsForRoute;
    };

    React.Children.forEach(children, (child) => {
      if (match || !React.isValidElement(child)) return;
      const routePath = child.props.path;
      if (!routePath) return;
      const paramsForRoute = tryMatch(routePath, path);
      if (paramsForRoute !== null) {
        match = child.props.element;
        matchedParams = paramsForRoute;
      }
    });

    if (!match) {
      React.Children.forEach(children, (child) => {
        if (match || !React.isValidElement(child)) return;
        if (child.props.path === "/") {
          match = child.props.element;
          matchedParams = {};
        }
      });
    }

    return { element: match, params: matchedParams };
  }, [children, path]);

  useEffect(() => {
    setParams(matchData.params);
  }, [matchData.params, setParams]);

  return matchData.element;
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

export function useLocation() {
  const { path } = useContext(RouterContext);
  return { pathname: path };
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useParams() {
  const { params } = useContext(RouterContext);
  return params;
}
