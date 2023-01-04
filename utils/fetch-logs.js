import http from "starless-http";
import { domain } from "../constants";

export default async function fetchLogs(router, dispatch, id, action = "logs") {
  dispatch({
    type: "SET_CONTAINER_ID",
    payload: {
      [id]: "",
    },
  });
  const [response, err] = await http.get(
    `${domain}/containers/${id}/${action}`,
    {
      params: {
        follow: "yes",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (err || response.status != 200) {
    if (err || response.status == 401) {
      localStorage.setItem("token", "");
      return router.push("/app-manager/login");
    }

    return false;
  }
}
