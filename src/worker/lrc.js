

self.onmessage = function ({ data: lrc }) {
  const lrcreg = /\[(\d+):(\d+)\.(\d+)\](.+)/g
  const lyctimereg = /\[(?<playTime>.+)\]\s?(?<lyc>.+)/;
  let regstr = null


  while ((regstr = lrcreg.exec(lrc)) !== null) {
    const lrcitems = Array.from(regstr)
    const lycplaytime = lrcitems[0].match(lyctimereg)



    let showtime = 0
    let lrc = ""

    for (let i = 1; i < lrcitems.length; i++) {
      const lrcitem = lrcitems[i]

      if (i === 1) {
        const second = parseInt(lrcitem) * 60
        showtime += second
      } else if (i === 2) {
        showtime += parseInt(lrcitem)
      } else if (i === 3) {
        const flotetime = "0." + lrcitem
        showtime += parseFloat(flotetime)
      } else if (i === 4) {
        lrc = lrcitem
      }
    }


    self.postMessage({ lrc, showtime, group: lycplaytime.groups })
  }

  self.postMessage("close")
  self.close()
}