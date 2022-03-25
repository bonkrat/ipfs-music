import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { FaPlay, FaPause, FaChromecast } from "react-icons/fa";
import LinearProgress from "@material/react-linear-progress";
import useAnimationFrame from "../hooks/useAnimationFrame";
import Loading from "../containers/Loading";
import PlayerContainer from "../containers/Player";

const styles = {
  loader: (loading) => classnames({ ["opacity-0"]: !loading }),
};

const playerStyles = {
  player: classnames(
    "flex",
    "justify-between",
    "items-center",
    "h-24",
    "w-full",
    "p-6",
    "bg-gray-800",
    "flex",
    "text-white"
  ),
  playerCenter: classnames(
    "w-3/6",
    "flex",
    "justify-between",
    "align-bottom",
    "h-full",
    "mx-10"
  ),
  elapsed: classnames(
    "w-1/12",
    "text-xs",
    "flex",
    "flex-col",
    "justify-end",
    "select-none"
  ),
  currentlyPlaying: classnames(
    "flex",
    "flex-col-reverse",
    "justify-center",
    "items-center",
    "align-middle",
    "items-center",
    "w-full",
    "mx-6"
  ),
  bar: classnames("text-gray-900", "bg-black", "w-full", "rounded-lg"),
  duration: classnames(
    "w-1/12",
    "text-xs",
    "flex",
    "flex-col",
    "justify-end",
    "align-bottom",
    "items-end",
    "select-none"
  ),
  metadata: classnames("flex", "justify-start", "text-xs", "w-2/6"),
  playButton: classnames("cursor-pointer", "pb-4"),
  artist: classnames("text-gray-600"),
  controls: classnames("flex", "justify-end", "w-2/6"),
};

const formatTime = (num) =>
  Number.parseFloat(Math.floor(num) / 60)
    .toPrecision(3)
    .split(".");

const Player = () => {
  const { song, isPlaying, play, pause } = PlayerContainer.useContainer();
  const metadata = song?.metadata;
  const [progress, setProgress] = useState(0);
  const { loading } = Loading.useContainer();
  const [minutes, seconds] = formatTime(song?.metadata?.duration);

  var elapsedMinutes = Math.floor(song?.sound?.seek() / 60) || 0;
  var elapsedSeconds = Math.floor(
    song?.sound?.seek() - elapsedMinutes * 60 || 0
  );

  useAnimationFrame(
    (deltaTime) => {
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state

      setProgress(
        (prev) =>
          song &&
          Number(
            (song?.sound?.seek() / song?.metadata?.duration).toPrecision(3)
          )
      );
    },
    [song, song?.sound, progress]
  );

  return (
    <>
      {/* <LinearProgress className={styles.loader(loading)} /> */}
      <div className={playerStyles.player}>
        <div className={playerStyles.metadata}>
          {metadata?.title ? (
            <div>
              <div>{metadata.title}</div>
              <div className={playerStyles.artist}>{metadata.artist}</div>
            </div>
          ) : (
            song?.filename
          )}
        </div>
        <div className={playerStyles.playerCenter}>
          <div className={playerStyles.elapsed}>
            {song
              ? `${elapsedMinutes}:${elapsedSeconds
                  .toString()
                  .padStart(2, "0")}`
              : "0:00"}
          </div>

          <div className={playerStyles.currentlyPlaying}>
            <div className={playerStyles.bar}>
              <LinearProgress
                className={playerStyles.bar}
                buffer={1}
                bufferingDots={false}
                progress={progress}
                indeterminate={loading}
              />
            </div>
            <div className={playerStyles.playButton}>
              {isPlaying ? (
                <FaPause onClick={pause} />
              ) : (
                <FaPlay onClick={play} />
              )}
            </div>
          </div>

          <div className={playerStyles.duration}>
            {minutes && seconds ? `${minutes}:${seconds}` : "0:00"}
          </div>
        </div>
        <div className={playerStyles.controls}>
          <FaChromecast />
        </div>
      </div>
    </>
  );
};

export default Player;
