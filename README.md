_An unfinished project, more of an experiment to toy with some tech. Read at your own risk... not meant for other eyes or to be taken seriously as it was just for my own learning back in 2019_

#ipfs-music
A peer-to-peer music streaming application built upon IPFS.  

![Screen Shot 2020-03-23 at 10 31 02 PM](https://user-images.githubusercontent.com/1292831/160134928-2ed38fd0-aba5-400e-82a1-2112ffa5cc19.png)

# Goals
- A Spotify-like application for playing music files. 
- Built in search for playing music available on a peer-to-peer network (a là Napster or Soulseek). 

# Stack
* Electron
* React
* Apollo Client
* [Howler](https://howlerjs.com)
* TailwindCSS
* IPFS/WebTorrent
  * trying both as I was initially having trouble with IPFS at the time.  I think IPFS would have been the way to go however as I could not quite get WebTorrent to work.

## IPFS
- Spin up an IPFS node and host their music on the IPFS network when the user selects their own library
- Provide a separate web service with a searchable list of songs and their IPFS hashes (legally dubious).

## WebTorrent
- Load WebTorrent, connect to a private tracker and seed their music to the other peers using the application. Pretty much the same functionality as the IPFS version
- Provide a separate web service with a searchable list of songs and their magnet links (especially legally dubious).  

## Getting around the legally dubious?
Hosting a web service that indexes IPFS hashes for MP3s seems a little less legally dubious than hosting magnet links. It's still dubious. To avoid any legal responsibility the idea was to eventually have a distributed database (or perhaps a serialized data structure downloaded from the P2P network on load) that would provide the data needed to index and search hashes locally.

# What is working?
Recalling how some of this worked back in 2019...

1. User loads application and sets their music directory in settings. Settings are saved in a file locally (no user accounts for privacy).
2. The application analyzes all of the files using `music-metadata`. Any non-music files are ignored. Music files are cached locally and displayed in a list in the application.
3. Users can play their own files locally with Pause/Play controls.

## WIP
- During development a hardcoded IPFS hash (or torrent magnet link) was used. I also had a local development setup for IPFS nodes (and later bittorrent tracker) for mocking the environment where the user would stream music from a torrent.  The P2P library would load the file as and stream it to the user as if it was locally. This was mostly working but was having issues. This is where I left off.

