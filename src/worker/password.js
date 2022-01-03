importScripts("md5.min.js");

self.onmessage = function ({ data }) {
  const value = data.trim();
  const hash = md5(value);
  self.postMessage(hash);
  self.close();
};

self.onerror = function (err) {
  console.error(err);
};
