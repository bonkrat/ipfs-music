import { createContainer } from "unstated-next";
import UserSettings from "./UserSettings";
import Files from "./Files";
import { useMutation, gql } from "@apollo/client";
import { ipcRenderer } from "electron";
import { TRACKS_QUERY } from "../components/Search";
import { useEffect } from "react";
import WebTorrent from "webtorrent";
import createTorrent from "create-torrent";
import fs from "fs";

const UPDATE_TRACK = gql`
  mutation updateTrack($input: TrackInput!) {
    updateTrack(track: $input) {
      success
      message
      track {
        id
        magnet
        infoHash
        metadata {
          title
          duration
        }
      }
    }
  }
`;

const clientPort = Math.floor(Math.random() * (60000 - 12000) + 12000);

const client = new WebTorrent({
  dht: false,
  tracker: {
    announce: ["http://0.0.0.0:8081/announce", "ws://0.0.0.0:8081"],
    private: true,
  },
  // tracker: {
  //   private: true,
  // },
  torrentPort: clientPort,
});

client.on("warning", function (warn) {
  console.log(warn);
});

client.on("error", function (err) {
  console.log(err);
});

client.on("wire", function () {
  console.log("wire...");
});

const buildInput = (file, infoHash, magnet) => ({
  id: file.id,
  filename: file.filename,
  ext: file.ext,
  infoHash,
  magnet,
  metadata: {
    title: file.metadata.title,
    artist: file.metadata.artist,
    duration: file.metadata.duration,
    lossless: file.metadata.format.lossless,
    container: file.metadata.format.container,
    codec: file.metadata.format.codec,
    sampleRate: file.metadata.format.sampleRate,
    numberOfChannels: file.metadata.format.numberOfChannels,
    bitrate: file.metadata.format.bitrate,
    track: file.metadata.track,
    disk: file.metadata.disk,
    artists: file.metadata.artists,
  },
});

export default createContainer(() => {
  const { setFile } = Files.useContainer();
  const { musicDir } = UserSettings.useContainer();
  const [updateTrack, { data, error, loading }] = useMutation(UPDATE_TRACK, {
    // refetchQueries: [{ query: TRACKS_QUERY }],
  });

  console.log("musicDir", musicDir);
  if (error) console.log(error);

  function seed(file) {
    console.log("WEBRTC_SUPPORT", WebTorrent.WEBRTC_SUPPORT);
    console.log("filepath", file.filePath);
    client.seed(
      file.filePath,
      {
        private: true,
        // worked with 8081?
        announceList: [["ws://0.0.0.0:8081"]],
        path: musicDir + "/",
        // announce: ["ws://0.0.0.0:8081"],
      },
      (torrent) => {
        console.log("Seeding file: " + file.filePath);
        console.log(torrent);
        torrent.on("error", function (err) {
          console.error(err);
        });

        torrent.on("warning", function (warn) {
          console.warn(warn);
        });

        console.log("infohash", torrent.infoHash);

        updateTrack({
          variables: {
            input: buildInput(file, torrent.infoHash, torrent.magnetURI),
          },
        });
        setFile({ ...file, torrent });
      }
    );
  }

  function stopSeeding(file) {
    client.remove(file.torrent.magnetURI, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Stopping seed for " + file.torrent.magnetURI);
      setFile({
        ...file,
        torrent: undefined,
      });
    });
  }

  useEffect(() => {
    ipcRenderer.on("seeding-file", (event, file) => {
      updateTrack({
        variables: {
          input: buildInput(file, file.torrent.magnetURI),
        },
      });
      setFile(file);
    });

    ipcRenderer.on("file-stopped-seeding", (event, file) => {
      setFile({
        ...file,
        torrent: undefined,
      });
    });
  }, []);

  return {
    seed,
    stopSeeding,
  };
});
