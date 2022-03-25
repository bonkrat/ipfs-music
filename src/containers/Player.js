import { useState } from "react";
import { createContainer } from "unstated-next";
import { Howl } from "howler";
import Loading from "../containers/Loading";

// const client = new WebTorrent({
//   dht: false,
//   tracker: {
//     announce: ["http://0.0.0.0:43210/announce", "ws://0.0.0.0:43210"],
//     private: true,
//   },
//   private: true,
//   torrentPort: 43210,
// });

export default createContainer(() => {
  const [song, loadSong] = useState();
  const { setLoading } = Loading.useContainer();
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => song?.sound.play();
  const pause = () => song?.sound.pause();

  const playSong = (song, file, url) => {
    if (song) {
      song.sound.stop();
    }

    const sound = new Howl({
      autoUnlock: true,
      src: [url],
      html5: true,
      onplay: function () {
        setLoading(() => false);
        setIsPlaying(() => true);
      },
      onpause: function () {
        setIsPlaying(() => false);
      },
      onseek: function () {
        console.log("seeking");
      },
    });

    loadSong(() => ({ ...file, sound }));

    sound.play();
  };

  const processFile = (file) => {
    if (file.magnet) {
      loadSong(() => ({ ...file }));
      setLoading(() => true);
      // client.add(
      //   file.magnet,
      //   {
      //     announce: ["http://0.0.0.0:43210/announce", "ws://0.0.0.0:43210"],
      //     path: musicDir,
      //     private: true,
      //   },
      //   (torrent) => {
      //     torrent.files.forEach((torrentFile) => {
      //       // Check if mp3 here
      //       // Analyze Torrent as well.
      //       torrentFile.getBlobURL((err, url) => {
      //         playSong(song, file, url);
      //       });
      //     });
      //   }
      // );
    } else {
      playSong(song, file, "http://localhost:5001/" + file.filename);
    }
  };

  return {
    song,
    isPlaying,
    loadSong,
    playFile: processFile,
    play,
    pause,
  };
});
