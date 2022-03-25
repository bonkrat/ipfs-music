import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, gql } from "@apollo/client";
import Loading from "../containers/Loading";
import FilesTable from "./FilesTable";

export const TRACKS_QUERY = gql`
  {
    tracks {
      id
      filename
      magnet
      metadata {
        title
        artist
        bitrate
        duration
      }
    }
  }
`;

const SearchInput = ({ setSearchValue }) => {
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 1000);

  const setSearch = (e) => {
    setText(e.target.value);
    setSearchValue(value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

const Search = () => {
  const { loading, error, data } = useQuery(TRACKS_QUERY);
  const { setLoading } = Loading.useContainer();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(() => loading);
  }, [loading]);

  if (error) {
    console.log(error);
  }

  return (
    <div>
      {/* <SearchInput setSearchValue={setSearchValue} /> */}
      <FilesTable files={data?.tracks} />
    </div>
  );
};

export default Search;
