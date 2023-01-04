import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ReactLoading from "react-loading";
import { appContext } from "../provider/AppProvider";
import SideBar from "./SideBar";
import { getSocket } from "../utils/socket";
import fetchLogs from "../utils/fetch-logs";

export default function Layout({ children }) {
  const router = useRouter();
  const [state, dispatch] = useContext(appContext);

  useEffect(() => {
    if (state.token) {
      const socket = getSocket();
      socket.on("connect", () => {
        console.log("Socket IO connected.");
        socket.on("deploy", ({ containerId, stdout, stderr, error }) => {
          try {
            const element = document.querySelector(
              `#deploy_${containerId} pre`
            );

            if (element) {
              if (stdout) {
                element.innerHTML += stdout;
              }
              if (stderr) {
                element.innerHTML += stderr;
              }
              if (error) {
                element.innerHTML += error;
              }
            }
            const parent = document.getElementById(`deploy_${containerId}`);
            if (parent) {
              parent.scrollTop = parent.scrollHeight;
            }
          } catch (err) {
            console.error(err);
          }
        });
        socket.on("logs", ({ containerId, stdout, stderr, error }) => {
          try {
            const element = document.querySelector(`#log_${containerId} pre`);

            if (element) {
              if (stdout) {
                element.innerHTML += stdout;
              }
              if (stderr) {
                element.innerHTML += stderr;
              }
              if (error) {
                element.innerHTML += error;
              }
            }
            const parent = document.getElementById(`log_${containerId}`);
            if (parent) {
              parent.scrollTop = parent.scrollHeight;
            }
          } catch (err) {
            console.error(err);
          }
        });
      });
      socket.on("disconnect", () => {
        console.log("Socket IO disconnected.");
      });
    }
  }, [state.token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: "SET_STATE", payload: { token } });
      if (router.pathname == "/app-manager/login") {
        router.push("/app-manager");
      }
    } else {
      router.push("/app-manager/login");
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     !router.pathname.includes("/app-manager/containers") &&
  //     !router.pathname.includes("/app-manager/applications")
  //   ) {
  //     for (const [containerId, logs] of Object.entries(state.containerIds)) {
  //       fetchLogs(router, dispatch, containerId, "cancel-logs-stream");
  //     }
  //   }
  // }, [router.pathname]);

  return (
    <div className="flex">
      {/* <nav
    className="w-60 h-screen shadow-2xl text-white "
    style={{ backgroundColor: "#1A1C1E" }}
  >
    <ul style={{ fontSize: 14 }}>
      <li
        className="py-2 px-4 m-6 rounded-xl cursor-pointer"
        style={{ backgroundColor: "#313334" }}
      >
        Product
      </li>
    </ul>
  </nav> */}
      {state.loading ? (
        <div className="z-50 h-screen fixed top-0 left-0 w-screen flex justify-center items-center">
          <ReactLoading
            type="spinningBubbles"
            color="#0285FF"
            height={50}
            width={50}
          />
        </div>
      ) : (
        ""
      )}
      {router.pathname != "/app-manager/login" ? <SideBar /> : ""}
      <div className="flex-grow overflow-auto h-screen">{children}</div>
    </div>
  );
}
