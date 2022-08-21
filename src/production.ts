export function appendBodyCdnJs() {
  const cdns = []


  //@ts-ignore
  if (import.meta.env.MODE === "prodution") {
    const body = document.querySelector("body")

    cdns.forEach((cdn) => {
      body?.appendChild(createScriptNode(cdn))
    })
  }


}


function createScriptNode(script: string) {
  const s = document.createElement("script")
  s.setAttribute("type", "text/javascript")
  s.src = script

  return s
}