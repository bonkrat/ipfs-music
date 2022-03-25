import Net from "net";

export default port =>
  new Promise((resolve, reject) => {
    const tester = Net.createServer()
      .once("error", err =>
        err.code === "EADDRINUSE" ? resolve(false) : reject(err)
      )
      .once("listening", () =>
        tester.once("close", () => resolve(true)).close()
      )
      .listen(port);
  });
