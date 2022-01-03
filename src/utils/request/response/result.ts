import type { CookieAttributes } from "js-cookie";
import type { AxiosResponse } from "axios";
import jsCookie from "js-cookie";

interface cookieOptions {
  name: string;
  value: string;
  options?: CookieAttributes;
}

export function reqCode(httpRes: AxiosResponse<any>) {
  switch (httpRes.status) {
    case 404:
      break;
    case 406:
      break;
    default:
      break;
  }
}

export function setCookie(httpRes: AxiosResponse<any>) {
  console.log(httpRes);

  // const cookie: string = httpRes.data.cookie;
  // cookie.split(";;").map((cookieItem) => {
  //   const cookieSplice = cookieItem.split(";");
  //   const setcookieObj: cookieOptions = {
  //     name: "",
  //     value: "",
  //     options: {
  //       expires: 0,
  //       path: "",
  //     },
  //   };
  //   for (let i = 0; i < cookieSplice.length; i++) {
  //     const spliceIndex = cookieSplice[i].indexOf("=");
  //     const [key, value] = [
  //       cookieSplice[i].slice(0, spliceIndex),
  //       cookieSplice[i].slice(spliceIndex + 1),
  //     ];
  //     if (i === 0) {
  //       setcookieObj.name = key;
  //       setcookieObj.value = value;
  //     } else if (key === "Max-Age") {
  //       setcookieObj.options.expires = parseInt(value);
  //     } else {
  //       const low = key.toLocaleLowerCase();
  //       const is = Object.prototype.toString.call(setcookieObj.options, low);
  //       if (is) {
  //         if (low === "expires" && setcookieObj.options.expires === 0) {
  //           setcookieObj.options.expires = value as unknown as Date;
  //         } else {
  //           continue;
  //         }
  //         setcookieObj.options[key] = value;
  //       }
  //     }
  //   }
  //   jsCookie.set(setcookieObj.name, setcookieObj.value, setcookieObj.options);
  // });
}
