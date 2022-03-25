import { createContainer } from "unstated-next";

export default createContainer(() => {
  function share() {}

  function stopSharing() {}

  return {
    share,
    stopSharing,
  };
});
