import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import "@material/react-linear-progress/dist/linear-progress.css";
import UserSettings from "./containers/UserSettings";
import Files from "./containers/Files";
import WebTorrent from "./containers/WebTorrent";
import Player from "./containers/Player";
import Loading from "./containers/Loading";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { HashRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./client";
import dotenv from "dotenv";

dotenv.config();

ReactDOM.render(
  <Router>
    <Loading.Provider>
      <UserSettings.Provider>
        <Files.Provider>
          <ApolloProvider client={client}>
            <WebTorrent.Provider>
              <Player.Provider>
                <App />
              </Player.Provider>
            </WebTorrent.Provider>
          </ApolloProvider>
        </Files.Provider>
      </UserSettings.Provider>
    </Loading.Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
