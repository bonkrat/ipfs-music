import React from "react";
import FilesTable from "./FilesTable";
import Files from "../containers/Files";

const Home = () => {
  const { files } = Files.useContainer();
  return <FilesTable files={files} />;
};

export default Home;
