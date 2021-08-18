export function useWatchLocal() {
  function onLocalStor(e: StorageEvent) {
    console.log(e);
  }

  //@ts-ignore
  useWatchLocal.closeEvent = function () {
    window.removeEventListener("storage", onLocalStor, false);
  };

  window.addEventListener("storage", onLocalStor, false);
}
