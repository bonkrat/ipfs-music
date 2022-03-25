import React from "react";
import "./App.css";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Search from "./components/Search";
import Player from "./components/Player";
import { classnames } from "tailwindcss-classnames";
import { GoGear, GoX, GoSearch } from "react-icons/go";
import { useQuery, gql } from "@apollo/client";

const styles = {
  app: classnames("flex", "flex-col", "h-screen", "pt-6"),
  main: classnames(
    "font-bold",
    "h-screen",
    "text-white",
    "px-12",
    "w-full",
    "h-auto",
    "overflow-y-scroll",
    "fade-in",
    "select-none"
  ),
  loader: (loading) => classnames({ ["opacity-0"]: !loading }),
};

const navigationStyles = {
  nav: classnames(
    "flex",
    "justify-between",
    "align-bottom",
    "px-12",
    "py-4",
    "box-border",
    "text-white",
    "fade-fast"
  ),
  functions: classnames("flex", "justify-end", "w-1/12", "items-center"),
  title: classnames(
    "text-4xl",
    "w-11/12",
    "font-bold",
    "fade-fast",
    "select-none"
  ),
  link: classnames(
    "py-4",
    "fade-fast",
    "ml-6",
    "text-gray-600",
    "hover:text-white"
  ),
};

const Navigation = () => {
  const location = useLocation();
  return (
    <div className={navigationStyles.nav}>
      {location.pathname === "/" && (
        <>
          <h1 className={navigationStyles.title}>Library</h1>
          <div className={navigationStyles.functions}>
            <Link className={navigationStyles.link} to="/search">
              <GoSearch />
            </Link>
            <Link className={navigationStyles.link} to="/settings">
              <GoGear />
            </Link>
          </div>
        </>
      )}
      {location.pathname === "/search" && (
        <>
          <h1 className={navigationStyles.title}>Search</h1>
          <div className={navigationStyles.functions}>
            <Link className={navigationStyles.link} to="/">
              <GoX />
            </Link>
          </div>
        </>
      )}
      {location.pathname === "/settings" && (
        <>
          <h1 className={navigationStyles.title}>Settings</h1>
          <div className={navigationStyles.functions}>
            <Link className={navigationStyles.link} to="/">
              <GoX />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const App = () => (
  <div
    className={classnames(styles.app, "animated-background")}
    style={{
      backgroundSize: "300% 300%",
      background:
        "linear-gradient(180deg, rgba(26,32,44,1) 0%, rgba(58,72,84,1) 100%)",
    }}
  >
    <Navigation />
    <div className={styles.main}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    </div>
    <Player />
  </div>
);

export default App;
