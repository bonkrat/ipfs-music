import React from "react";
import Player from "../containers/Player";
import Loading from "../containers/Loading";
import WebTorrent from "../containers/WebTorrent";
import { classnames } from "tailwindcss-classnames";
import { FaVolumeUp } from "react-icons/fa";
import { IoMdCloudOutline, IoMdCloud } from "react-icons/io";

const filesStyles = {
  table: classnames("table", "w-full", "overflow-y-scroll"),
  header: classnames(
    "text-xs",
    "font-thin",
    "text-gray-500",
    // "sticky", // fix this
    "top-0",
    "border-0"
  ),
  headerRow: classnames("sticky"),
  // playing: classnames("fixed"),
  row: (loading = false) =>
    classnames(
      "border-t",
      "text-sm",
      "table-row",
      "fade-in",
      { ["text-gray-800"]: loading },
      { ["cursor-pointer"]: !loading },
      { ["hover:bg-gray-800"]: !loading }
    ),
  loadingRow: classnames("h-12", "border-t", "text-sm", "table-row"),
  loader: classnames(
    "text-3xl",
    "flex",
    "justify-center",
    "items-center",
    "w-screen",
    "absolute",
    "text-gray-300"
  ),
  cell: classnames(
    "border-gray-800",
    "border-b",
    "table-cell",
    "text-sm",
    "font-normal",
    "py-4",
    "px-1"
  ),
  playing: classnames(
    "text-gray-500",
    "flex",
    "align-middle",
    "justify-center",
    "items-center",
    "px-0",
    "border-b"
  ),
  icon: (playing) =>
    classnames("m-auto", {
      ["invisible"]: !playing,
    }),
  title: classnames("whitespace-no-wrap"),
  seeding: (seeding = false) =>
    classnames(
      "text-xl",
      "flex",
      "align-middle",
      "justify-center",
      "items-center",
      {
        ["text-gray-400"]: seeding,
      },
      {
        ["text-gray-600"]: !seeding,
      }
    ),
};

const FilesRow = ({ file, onClick }) => {
  const { duration } = file?.metadata;
  // const { loading } = Loading.useContainer();
  const { song } = Player.useContainer();
  const { seed, stopSeeding } = WebTorrent.useContainer();

  const { artist, title } = file?.metadata || "";
  const [minutes, seconds] = Number.parseFloat(Math.floor(duration) / 60)
    .toPrecision(3)
    .split(".");
  const trackDuration = `${minutes}:${seconds}`;

  const onSeed = (e, file) => {
    e.stopPropagation();
    seed(file);
  };

  const onStopSeeding = (e, file) => {
    e.stopPropagation();
    stopSeeding(file);
  };

  return (
    <div className={filesStyles.row()} onClick={onClick}>
      <div className={classnames(filesStyles.cell, filesStyles.playing)}>
        {<FaVolumeUp className={filesStyles.icon(song?.id === file?.id)} />}
      </div>
      <div className={classnames(filesStyles.cell, filesStyles.title)}>
        {title}
      </div>
      <div className={classnames(filesStyles.cell)}>{artist}</div>
      <div className={classnames(filesStyles.cell)}>{trackDuration}</div>

      <div
        className={classnames(
          filesStyles.cell,
          filesStyles.seeding(file?.torrent?.ready)
        )}
      >
        {file?.torrent?.ready ? (
          <IoMdCloud
            className={filesStyles.icon(true)}
            onClick={(e) => onStopSeeding(e, file)}
          />
        ) : (
          <IoMdCloudOutline
            className={filesStyles.icon(true)}
            onClick={(e) => onSeed(e, file)}
          />
        )}
      </div>
    </div>
  );
};

const LoadingFilesRow = () => {
  return (
    <div className={filesStyles.loadingRow}>
      <div className={classnames(filesStyles.cell)}></div>
      <div className={classnames(filesStyles.cell, filesStyles.title)}></div>
      <div className={classnames(filesStyles.cell)}></div>
      <div className={classnames(filesStyles.cell)}></div>
      <div className={classnames(filesStyles.cell)}></div>
    </div>
  );
};

const FilesPlacholder = () => {
  const rows = [];
  for (var i = 0; i < 10; i++) {
    rows[i] = <LoadingFilesRow key={i} />;
  }
  return <>{rows}</>;
};

const FilesTableHeader = () => {
  return (
    <div className={classnames("table-row", filesStyles.headerRow)}>
      {["", "Title", "Artist", "Time", ""].map((header, index) => {
        return (
          <div
            key={index}
            className={classnames(filesStyles.cell, filesStyles.header)}
          >
            {header}
          </div>
        );
      })}
    </div>
  );
};

const FilesTable = ({ files }) => {
  const { playFile } = Player.useContainer();

  return (
    <div className={filesStyles.table}>
      <div className={classnames("table-row-group")}>
        <FilesTableHeader />

        {files.map((file) => {
          return (
            <FilesRow
              key={file.id}
              file={file}
              onClick={() => playFile(file)}
            />
          );
        })}
      </div>
    </div>
  );
};

FilesTable.defaultProps = {
  files: [],
};

export default FilesTable;
