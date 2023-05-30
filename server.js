const http = require("node:http");
const https = require("node:https");

const client_secret = process.env.GITHUB_CLIENT_SECRET;

const handleMessage = (message, handleEnd, handleError) => {
  let rawData = "";

  message.on("data", (chunk) => {
    rawData += chunk;
  });

  message.on("end", () => {
    handleEnd(rawData);
  });

  message.on("error", (err) => {
    console.error(err);
    handleError(err);
  });
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (req.url) {
    case "/github_access_token":
      handleMessage(
        req,
        (rawData) => {
          const ghreq = https.request(
            "https://github.com/login/oauth/access_token",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
            },
            (ghres) => {
              handleMessage(
                ghres,
                (ghRawData) => {
                  res.end(ghRawData);
                },
                (ghErr) => {
                  ghres.end(ghErr);
                }
              );
            }
          );

          ghreq.on("error", (err) => {
            console.error(err);
            res.end();
          });

          ghreq.end(`client_secret=${client_secret}&${rawData}`);
        },
        (err) => {
          res.end(err);
        }
      );
      break;
    case "":
      break;
    default:
      res.end("404");
  }
});

server.listen(9900);
