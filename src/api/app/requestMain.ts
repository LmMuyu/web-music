import request from "../../utils/request";

export  function countries(url = "/countries/code/list") {
  return request({
    method: "GET",
    url,
  });
}
