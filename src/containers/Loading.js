import { useState } from "react";
import { createContainer } from "unstated-next";

export default createContainer(() => {
  const [loading, setLoading] = useState(false);

  return {
    loading,
    setLoading
  };
});
