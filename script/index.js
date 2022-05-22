const { execFile } = require("node:child_process");
const path = require("node:path");

async function rmdist() {
  const dist = path.join(process.cwd(), "/dist");
  const che = await execFile("rm",["F:/project/web-music/dist"]);

  che.on("error", (err) => {
    console.log(err.message.toString());
  });

  che.stdout.on("data", (chunk) => {
    console.log(chunk.toString());
  });
}

rmdist();
