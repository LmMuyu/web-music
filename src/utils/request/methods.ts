import Cookie from "js-cookie";
import type { CookieAttributes } from "js-cookie";

interface cookieOptions {
  name: string;
  value: string;
  options: CookieAttributes;
}

export function setCookie(cookie: string) {
  const matchList = cookie.match(/.+?(?=;;)/gi);

  if (matchList) {
    for (const v of matchList) {
      const cookieObj: cookieOptions = {
        name: "",
        value: "",
        options: {
          path: "",
          expires: 0,
        },
      };

      if (v[0] === ";") {
        const cookieStr = v.substring(2);
        splitCookie(cookieStr, cookieObj);
      } else {
        const cookieStr = v;
        splitCookie(cookieStr, cookieObj);
      }
    }
  }
}

function splitCookie(cookie: string, cookieObj: cookieOptions) {
  const splitList = cookie.split(";");

  splitList.forEach((v, i) => {
    const sliceIndex = v.indexOf("=");
    let [key, value] = [v.slice(0, sliceIndex), v.slice(sliceIndex + 1)];

    if (i === 0) {
      cookieObj.name = key;
      cookieObj.value = value;
    } else {
      const options = cookieObj.options;
      type keys = keyof typeof options;

      const name = key.toLocaleLowerCase().trim();
      if (Object.prototype.hasOwnProperty.call(options, name)) {
        let optionValue: string | Date = value;
        if (name === "expires") optionValue = new Date(value);
        options[name as keys] = optionValue;
      }
    }
  });

  const {
    name,
    value,
    options: { expires, path },
  } = cookieObj;

  Cookie.set(name, value, {
    path,
    expires,
    domain: window.location.host,
  });
}
