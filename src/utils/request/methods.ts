import setcookie from "js-cookie"

export function setCookie(cookie: string) {
  const matchList = cookie.match(/.+?(?=;;)/gi);

  if (matchList) {
    for (const v of matchList) {
      const cookieObj = {
         
      };

      if (v[0] === ";") {
        const cookie = v.substring(2);
        const splitList = cookie.split(";");

        splitList.forEach((v) => {
          const sliceIndex = v.indexOf("=");
          // cookieObj.set(v.slice(0, sliceIndex), v.slice(sliceIndex + 1));
        });
      }

    }
  }
}
