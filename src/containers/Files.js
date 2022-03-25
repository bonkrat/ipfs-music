import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import UserSettings from "./UserSettings";
import Loading from "./Loading";
import fs from "fs";
import FileType from "file-type";
import createTorrent from "create-torrent";
import { v4 as uuidv4 } from "uuid";
import * as mm from "music-metadata";
import { ipcRenderer } from "electron";

// function scanDir(filePath) {
//     if (!filePath || filePath[0] == 'undefined') return;

//     var arr = walkSync(filePath[0]);

//     var arg = {};
//     arg.files = arr;
//     arg.path = filePath;

//     startPlayer(arg)
//   }

// var walkSync = function (dir, filelist) {
//     files = fs.readdirSync(dir);
//     filelist = filelist || [];
//     files.forEach(function (file) {
//       if (fs.statSync(path.join(dir, file)).isDirectory()) {
//         filelist = walkSync(path.join(dir, file), filelist);
//       }
//       else {
//         if (file.substr(-4) === '.mp3' || file.substr(-4) === '.m4a'
//           || file.substr(-5) === '.webm' || file.substr(-4) === '.wav'
//           || file.substr(-4) === '.aac' || file.substr(-4) === '.ogg'
//           || file.substr(-5) === '.opus') {
//           filelist.push(path.join(dir, file));
//         }
//       }
//     });
//     return filelist;
//   };

async function processFiles(musicDir, filePaths) {
  filePaths.forEach(({ filePath }) => {
    const torrentPath = filePath + ".torrent";

    // Check if the file has a torrent file already
    try {
      if (!fs.existsSync(torrentPath)) {
        // If it doesn't add one for the file
        createTorrent(filePath, (err, torrent) => {
          if (!err) {
            fs.writeFile(
              torrentPath,
              torrent,
              (err) => err && console.log(err)
            );
          } else {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
}

export default createContainer(() => {
  const [files, setFiles] = useState([]);
  const { musicDir, cache, setUserSettings } = UserSettings.useContainer();
  const { setLoading } = Loading.useContainer();

  const setFile = (file) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.map((f) => {
        if (f.id === file.id) {
          return file;
        } else {
          return f;
        }
      });

      return newFiles;
    });
  };

  useEffect(() => {
    if (musicDir) {
      if (cache && cache.length) {
        setFiles(() => {
          return cache;
        });

        // processFiles(musicDir, cache);
      } else {
        setLoading(() => true);

        fs.readdir(musicDir, async function (err, dir) {
          if (err) {
            throw new Error(err);
          } else {
            if (dir.length) {
              setFiles(() => []);

              const f = Promise.all(
                dir.map(async (filename) => {
                  const filePath = musicDir + "/" + filename;

                  const getFileStat = () =>
                    new Promise((resolve, reject) => {
                      fs.lstat(filePath, (err, stats) => {
                        if (err) {
                          return reject(err);
                        }

                        return resolve(stats);
                      });
                    });

                  const fileStat = await getFileStat();

                  if (await fileStat.isFile()) {
                    return {
                      filename,
                      filePath,
                      ...(await FileType.fromFile(filePath)),
                    };
                  }
                })
              );

              const mp3s = await Promise.all(
                (await f)
                  .filter((file) => {
                    return file && file.mime === "audio/mpeg";
                  })
                  .map(async (file) => {
                    const metadata = await mm.parseFile(file.filePath);

                    return {
                      ...file,
                      id: uuidv4(),
                      metadata: {
                        ...metadata,
                        ...metadata.common,
                        ...metadata.format,
                      },
                    };
                  })
              );

              setFiles(() => {
                return mp3s;
              });

              ipcRenderer.send("start-static-server", musicDir);

              setUserSettings(() => ({
                cache: mp3s,
              }));

              // processFiles(musicDir, mp3s);

              setLoading(() => false);
            }
          }
        });
      }
    }
  }, [musicDir, cache]);

  return {
    files,
    setFile,
    setFiles,
  };
});
