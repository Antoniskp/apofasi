import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../lib/api.js";
import { useTheme } from "../lib/ThemeContext.jsx";

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      // Focus first menu item after opening
      setTimeout(() => {
        menuRef.current?.querySelector('[role="menuitem"]')?.focus();
      }, 0);
    }
  };

  const handleMenuItemKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      // Find next menuitem, skipping separators
      let nextElement = event.target.nextElementSibling;
      while (nextElement && nextElement.getAttribute("role") !== "menuitem") {
        nextElement = nextElement.nextElementSibling;
      }
      if (nextElement) {
        nextElement.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      // Find previous menuitem, skipping separators
      let prevElement = event.target.previousElementSibling;
      while (prevElement && prevElement.getAttribute("role") !== "menuitem") {
        prevElement = prevElement.previousElementSibling;
      }
      if (prevElement) {
        prevElement.focus();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsOpen(false);
      if (onLogout) {
        onLogout();
      }
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Don't close menu immediately to provide feedback
  };

  const isAuthenticated = Boolean(user);
  const userName = user?.displayName || user?.firstName || user?.email || "User";
  const userAvatar = user?.avatar;

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        className="user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
      >
        {isAuthenticated ? (
          <>
            {userAvatar ? (
              <img src={userAvatar} alt="" className="user-menu-avatar" />
            ) : (
              <span className="user-menu-icon" aria-hidden="true">
                <i className="fa-solid fa-circle-user" />
              </span>
            )}
            <span className="user-menu-name">{userName}</span>
            <i className={`fa-solid fa-chevron-down user-menu-chevron ${isOpen ? "open" : ""}`} aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="user-menu-icon" aria-hidden="true">
              <i className="fa-solid fa-circle-user" />
            </span>
            <span className="user-menu-name">Menu</span>
            <i className={`fa-solid fa-chevron-down user-menu-chevron ${isOpen ? "open" : ""}`} aria-hidden="true" />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {isAuthenticated ? (
            <>
              <Link
                to="/polls/my-polls"
                role="menuitem"
                className="user-menu-item"
                onClick={handleLinkClick}
                onKeyDown={(e) => handleMenuItemKeyDown(e, () => {
                  handleLinkClick();
                  navigate("/polls/my-polls");
                })}
                tabIndex={0}
              >
                <i className="fa-solid fa-square-poll-vertical" aria-hidden="true" />
                <span>My Polls</span>
              </Link>
              <Link
                to="/profile"
                role="menuitem"
                className="user-menu-item"
                onClick={handleLinkClick}
                onKeyDown={(e) => handleMenuItemKeyDown(e, () => {
                  handleLinkClick();
                  navigate("/profile");
                })}
                tabIndex={0}
              >
                <i className="fa-solid fa-user" aria-hidden="true" />
                <span>Profile</span>
              </Link>
              <div className="user-menu-separator" role="separator" />
              <button
                type="button"
                role="menuitem"
                className="user-menu-item"
                onClick={handleLogout}
                onKeyDown={(e) => handleMenuItemKeyDown(e, handleLogout)}
                tabIndex={0}
              >
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                role="menuitem"
                className="user-menu-item"
                onClick={handleLinkClick}
                onKeyDown={(e) => handleMenuItemKeyDown(e, () => {
                  handleLinkClick();
                  navigate("/auth");
                })}
                tabIndex={0}
              >
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
                <span>Sign in</span>
              </Link>
              <Link
                to="/register"
                role="menuitem"
                className="user-menu-item"
                onClick={handleLinkClick}
                onKeyDown={(e) => handleMenuItemKeyDown(e, () => {
                  handleLinkClick();
                  navigate("/register");
                })}
                tabIndex={0}
              >
                <i className="fa-solid fa-user-plus" aria-hidden="true" />
                <span>Sign up</span>
              </Link>
            </>
          )}
          <div className="user-menu-separator" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="user-menu-item"
            onClick={handleThemeToggle}
            onKeyDown={(e) => handleMenuItemKeyDown(e, handleThemeToggle)}
            tabIndex={0}
          >
            <i className={`fa-solid fa-${theme === "dark" ? "sun" : "moon"}`} aria-hidden="true" />
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
