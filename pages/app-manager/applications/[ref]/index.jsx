import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import http from "starless-http";
import Swal from "sweetalert2";
import moment from "moment/moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import { domain } from "../../../../constants";
import { appContext } from "../../../../provider/AppProvider";
import fetchLogs from "../../../../utils/fetch-logs";

const defaultEnvironments = [
  {
    key: "",
    value: "",
  },
];

const defaultVolumes = [
  {
    source: "",
    destination: "",
  },
];

export default function Application({ appref }) {
  const [state, dispatch] = useContext(appContext);
  const router = useRouter();
  const [bItems, setBItems] = useState([
    {
      label: "Dashboard",
      to: "/app-manager",
    },
    {
      label: "Application",
      to: "/app-manager/applications",
    },
    {
      label: "New Application",
      to: `/app-manager/applications/${appref}`,
    },
  ]);
  const [ref, setRef] = useState(appref);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [git, setGit] = useState("");
  const [gitbranch, setGitBranch] = useState("");
  const [containerPort, setContainerPort] = useState("");
  const [exposePort, setExposePort] = useState("");
  const [deployment, setDeployment] = useState("");
  const [environments, setEnvironments] = useState(defaultEnvironments);
  const [volumes, setVolumes] = useState(defaultVolumes);
  const [network, setNetwork] = useState("");
  const [status, setStatus] = useState("new");
  const [deployments, setDeployments] = useState([]);
  const [versions, setVersions] = useState([]);
  const [activeMenu, setActiveMenu] = useState("overview");
  const [containerId, setContainerId] = useState("");

  useEffect(() => {
    if (activeMenu == "log") {
      fetchLogs(router, dispatch, containerId);
    } else {
      fetchLogs(router, dispatch, containerId, "cancel-logs-stream");
    }
  }, [activeMenu]);

  const fetchDeployments = async () => {
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.get(`${domain}/deployments`, {
      params: {
        projection: JSON.stringify({
          name: 1,
          version: 1,
        }),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    setDeployments([
      ...response.data.data.map((d) => ({
        key: d._id,
        value: d._id,
        label: `${d.name} (${d.version})`,
      })),
    ]);
    if (response.data.data.length) {
      setDeployment(response.data.data[0]._id);
    }
  };

  const fetchData = async (r = null) => {
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.get(
      `${domain}/applications/${r || appref}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    const { ref, name, version, git, gitbranch, deployment } =
      response.data.data;
    const { port, volumes, environments, status, network, _id } =
      response.data.container;
    setContainerId(_id);
    setRef(ref);
    setBItems([
      {
        label: "Dashboard",
        to: "/app-manager",
      },
      {
        label: "Application",
        to: "/app-manager/applications",
      },
      {
        label: name,
        to: `/app-manager/applications/${ref}`,
      },
    ]);
    setName(name);
    setVersion(version);
    setGit(git);
    setGitBranch(gitbranch);
    if (port) {
      const ports = port.split(":");
      if (ports.length > 1) {
        setExposePort(ports[0]);
        setContainerPort(ports[1]);
      }
    }

    setDeployment(deployment);
    setVolumes(
      volumes.length
        ? volumes
            .filter((volume) => volume)
            .map((volume) => {
              const [source, destination] = volume.split(":");
              return { source, destination };
            })
        : defaultVolumes
    );
    setEnvironments(
      environments && Object.keys(environments).length
        ? Object.entries(environments).map(([key, value]) => ({ key, value }))
        : defaultEnvironments
    );
    setStatus(status);
    setNetwork(network);
    setVersions(response.data.versions);
  };

  useEffect(() => {
    fetchDeployments();
    if (ref != "new") {
      fetchData();
    } else {
      setRef(appref);
      setBItems([
        {
          label: "Dashboard",
          to: "/app-manager",
        },
        {
          label: "Application",
          to: "/app-manager/applications",
        },
        {
          label: "New Application",
          to: `/app-manager/applications/${appref}`,
        },
      ]);
      setName("");
      setVersion("");
      setGit("");
      setGitBranch("");
      setExposePort("");
      setContainerPort("");
      setDeployment("");
      setNetwork("");
      setEnvironments(defaultEnvironments);
      setVolumes(defaultVolumes);
    }
  }, []);

  const handleSave = async () => {
    if (state.loading) {
      return false;
    }
    const bodyEnvironments = {};
    for (const { key, value } of environments) {
      if (key && value) {
        bodyEnvironments[key] = value;
      }
    }
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.post(
      `${domain}/applications`,
      {
        name,
        version,
        git,
        gitbranch,
        port:
          exposePort && containerPort ? `${exposePort}:${containerPort}` : "",
        deployment,
        environments: bodyEnvironments,
        volumes: volumes
          .filter(({ source, destination }) => source && destination)
          .map(({ source, destination }) => `${source}:${destination}`),
        network,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 201) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    await Swal.fire({
      icon: "success",
      text: response.data.message,
    });
    setRef(response.data.data.ref);
    await handleAction("deploy", response.data.data.ref, version);
    router.push(`/app-manager/applications/${response.data.data.ref}`);
  };

  const handleUpdate = async () => {
    if (state.loading) {
      return false;
    }
    const bodyEnvironments = {};
    for (const { key, value } of environments) {
      if (key && value) {
        bodyEnvironments[key] = value;
      }
    }
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.put(
      `${domain}/applications/${ref}`,
      {
        name,
        git,
        gitbranch,
        port:
          exposePort && containerPort ? `${exposePort}:${containerPort}` : "",
        deployment,
        environments: bodyEnvironments,
        volumes: volumes
          .filter(({ source, destination }) => source && destination)
          .map(({ source, destination }) => `${source}:${destination}`),
        network,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }

    await Swal.fire({
      icon: "success",
      text: response.data.message,
    });
    fetchData(ref);
  };

  const handleDelete = async () => {
    if (state.loading) {
      return false;
    }
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.delete(`${domain}/applications/${ref}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch({ type: "SET_STATE", payload: { loading: false } });

    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    await Swal.fire({
      icon: "success",
      text: response.data.message,
    });
    router.push("/app-manager/applications");
  };

  const handleContainerAction = async (action, cid, r) => {
    if (state.loading) {
      return false;
    }
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.get(
      `${domain}/containers/${cid}/${action}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    await Swal.fire({
      icon: "success",
      text: response.data.message,
    });

    fetchData(r);
  };

  const handleAction = async (action, r = null, v = null) => {
    if (action == "deploy") {
      setStatus("deploy");
    }
    setNewVersion("");
    if (state.loading) {
      return false;
    }
    dispatch({
      type: "SET_STATE",
      payload: { loading: action == "deploy" ? false : true },
    });
    const [response, err] = await http.get(
      `${domain}/applications/${r || ref}/${action}`,
      {
        params: {
          version: v || version,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      if (err || response.status == 401) {
        localStorage.setItem("token", "");
        return router.push("/app-manager/login");
      }
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    await Swal.fire({
      icon: "success",
      text: response.data.message,
    });

    fetchData(r);
  };

  const getStatusColor = (status) => {
    if (status == "running") {
      return "#02b602";
    } else if (status == "stop") {
      return "#ff4135";
    } else {
      return "#0285ff";
    }
  };

  return (
    <div className="p-10 md:ml-20 mb-20 m-0">
      <div className="mb-5">
        <BreadCrumb items={bItems} />
      </div>
      <div className="mb-3 flex justify-between">
        <div
          className="btn-group bg-white shadow-xl"
          style={{ borderRadius: "2rem" }}
        >
          <button
            onClick={() => setActiveMenu("overview")}
            className="btn w-28"
            style={{
              borderRadius: "2rem",
              textTransform: "none",
              background: activeMenu == "overview" ? "#0285FF" : "#ffffff",
              borderColor: activeMenu == "overview" ? "#0285FF" : "#ffffff",
              color: activeMenu == "overview" ? "#ffffff" : "#000000",
            }}
          >
            Overview
          </button>
          {ref == "new" ? null : (
            <button
              onClick={() => setActiveMenu("version")}
              className="btn w-28"
              style={{
                borderRadius: "2rem",
                textTransform: "none",
                background: activeMenu == "version" ? "#0285FF" : "#ffffff",
                borderColor: activeMenu == "version" ? "#0285FF" : "#ffffff",
                color: activeMenu == "version" ? "#ffffff" : "#000000",
              }}
            >
              Versions
            </button>
          )}
          {ref == "new" ? null : (
            <button
              onClick={() => setActiveMenu("log")}
              className="btn w-28"
              style={{
                borderRadius: "2rem",
                textTransform: "none",
                background: activeMenu == "log" ? "#0285FF" : "#ffffff",
                borderColor: activeMenu == "log" ? "#0285FF" : "#ffffff",
                color: activeMenu == "log" ? "#ffffff" : "#000000",
              }}
            >
              Logs
            </button>
          )}
        </div>
        <div className="flex">
          {versions.length ? (
            <div className="px-1">
              <select
                value={version}
                onChange={(e) => {
                  setVersion(e.target.value);

                  handleAction("change-version", ref, e.target.value);
                }}
                className="select w-full outline-none rounded-xl shadow-lg"
                style={{ fontSize: 14, borderWidth: 1 }}
              >
                {versions.map((v) => (
                  <option key={v._id} value={v.version}>
                    {v.version}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div
            className=" text-white flex items-center rounded-xl shadow-lg justify-center w-32 ml-3"
            style={{ background: getStatusColor(status) }}
          >
            {status}
          </div>
        </div>
      </div>
      <div className="card shadow-xl bg-white">
        {activeMenu == "overview" && status != "deploy" ? (
          <div className="card-body">
            <div className="flex mb-3 flex-wrap">
              {ref == "new" ? (
                <div className="p-1">
                  <input
                    type="checkbox"
                    id="save-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box">
                      <div className="p-2">
                        <div className="mb-2" style={{ fontSize: 14 }}>
                          Version
                        </div>
                        <input
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          type="text"
                          className="input input-bordered w-full rounded-xl"
                        />
                      </div>
                      <div className="modal-action justify-between">
                        <div className="p-1">
                          <label
                            htmlFor="save-modal"
                            className="btn btn-outline w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              // background: "#02b602",
                              // borderColor: "#02b602",
                            }}
                          >
                            Cancel
                          </label>
                        </div>
                        <div className="p-1">
                          <label
                            onClick={handleSave}
                            htmlFor="save-modal"
                            className="btn text-white w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              background: "#02b602",
                              borderColor: "#02b602",
                            }}
                          >
                            Save
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label
                    htmlFor="save-modal"
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#02b602",
                      borderColor: "#02b602",
                    }}
                  >
                    Save
                  </label>
                </div>
              ) : (
                <div className="p-1">
                  <button
                    onClick={handleUpdate}
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#02b602",
                      borderColor: "#02b602",
                    }}
                  >
                    Update
                  </button>
                </div>
              )}

              {ref == "new" ? null : (
                <div className="p-1">
                  <input
                    type="checkbox"
                    id="delete-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box flex flex-col h-52">
                      <h1 className="text-2xl flex-grow flex items-center justify-center">
                        Are you sure you want to delete?
                      </h1>

                      <div className="modal-action justify-between">
                        <div className="p-1">
                          <label
                            htmlFor="delete-modal"
                            className="btn btn-outline w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              // background: "#02b602",
                              // borderColor: "#02b602",
                            }}
                          >
                            Cancel
                          </label>
                        </div>
                        <div className="p-1">
                          <label
                            onClick={handleDelete}
                            htmlFor="delete-modal"
                            className="btn text-white w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              background: "#ff4135",
                              borderColor: "#ff4135",
                            }}
                          >
                            Delete
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label
                    htmlFor="delete-modal"
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#ff4135",
                      borderColor: "#ff4135",
                    }}
                  >
                    Delete
                  </label>
                </div>
              )}
              {ref == "new" ? null : (
                <div className="p-1">
                  <button
                    onClick={() => {
                      handleContainerAction("start", containerId, ref);
                    }}
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#0285FF",
                      borderColor: "#0285FF",
                    }}
                  >
                    Start
                  </button>
                </div>
              )}
              {ref == "new" ? null : (
                <div className="p-1">
                  <button
                    onClick={() => {
                      handleContainerAction("stop", containerId, ref);
                    }}
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#0285FF",
                      borderColor: "#0285FF",
                    }}
                  >
                    Stop
                  </button>
                </div>
              )}
              {ref == "new" ? null : (
                <div className="p-1">
                  <button
                    onClick={() => {
                      handleContainerAction("restart", containerId, ref);
                    }}
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#0285FF",
                      borderColor: "#0285FF",
                    }}
                  >
                    Restart
                  </button>
                </div>
              )}
              {ref == "new" ? null : (
                <div className="p-1">
                  <input
                    type="checkbox"
                    id="deploy-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box">
                      <div className="p-2">
                        <div className="mb-2" style={{ fontSize: 14 }}>
                          Version
                        </div>
                        <input
                          value={newVersion}
                          onChange={(e) => setNewVersion(e.target.value)}
                          type="text"
                          className="input input-bordered w-full rounded-xl"
                        />
                      </div>
                      <div className="modal-action justify-between">
                        <div className="p-1">
                          <label
                            onClick={() => {
                              setNewVersion("");
                            }}
                            htmlFor="deploy-modal"
                            className="btn btn-outline w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              // background: "#02b602",
                              // borderColor: "#02b602",
                            }}
                          >
                            Cancel
                          </label>
                        </div>
                        <div className="p-1">
                          <label
                            onClick={() =>
                              handleAction("deploy", ref, newVersion)
                            }
                            htmlFor="deploy-modal"
                            className="btn text-white w-28 rounded-3xl"
                            style={{
                              textTransform: "none",
                              background: "#EA4C89",
                              borderColor: "#EA4C89",
                            }}
                          >
                            Deploy
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label
                    htmlFor="deploy-modal"
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#EA4C89",
                      borderColor: "#EA4C89",
                    }}
                  >
                    Deploy
                  </label>
                </div>
              )}
              {ref == "new" ? null : (
                <div className="dropdown">
                  <label
                    tabIndex={0}
                    className="btn text-white w-36 rounded-3xl"
                    style={{
                      textTransform: "none",
                      background: "#0285FF",
                      borderColor: "#0285FF",
                      marginTop: 3,
                    }}
                  >
                    Export
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a
                        download
                        href={`${domain}/applications/${ref}/export?type=docker-compose&token=${state.token}`}
                      >
                        Compose File
                      </a>
                    </li>
                    <li>
                      <a
                        download
                        href={`${domain}/applications/${ref}/export?type=tar&token=${state.token}`}
                      >
                        Tar File
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap mb-3">
              <div className="p-2 w-1/4">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Name
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="p-2 w-1/4">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Base Image
                </div>
                <select
                  value={deployment}
                  onChange={(e) => setDeployment(e.target.value)}
                  className="select select-bordered w-full outline-none rounded-xl"
                  style={{ fontSize: 14, borderWidth: 1 }}
                >
                  {deployments.map((d) => (
                    <option key={d.key} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-2 w-1/6">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Network
                </div>
                <input
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-wrap mb-3">
              <div className="p-2 w-1/6">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Expose Port
                </div>
                <input
                  value={exposePort}
                  onChange={(e) => setExposePort(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
              <div className="p-2 w-1/6">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Container Port
                </div>
                <input
                  value={containerPort}
                  onChange={(e) => setContainerPort(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>
            <hr />
            <div className="flex flex-wrap mb-3">
              <div className="p-2 w-1/2">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Git
                </div>
                <input
                  value={git}
                  onChange={(e) => setGit(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
              <div className="p-2">
                <div className="mb-2" style={{ fontSize: 14 }}>
                  Branch
                </div>
                <input
                  value={gitbranch}
                  onChange={(e) => setGitBranch(e.target.value)}
                  type="text"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>
            <hr />
            <h1 className="px-2 mt-3" style={{ fontSize: 14 }}>
              Application Config
            </h1>
            {environments.map((environment, i) => (
              <div key={i} className="flex flex-wrap">
                <div className="p-2 w-1/4">
                  <input
                    placeholder="Key"
                    value={environment.key}
                    onChange={(e) => {
                      const newEnvs = [...environments];
                      newEnvs[i]["key"] = e.target.value;
                      setEnvironments(newEnvs);
                    }}
                    type="text"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div className="p-2 w-1/4">
                  <input
                    placeholder="Value"
                    value={environment.value}
                    onChange={(e) => {
                      const newEnvs = [...environments];
                      newEnvs[i]["value"] = e.target.value;
                      setEnvironments(newEnvs);
                    }}
                    type="text"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div className="p-2 flex items-center">
                  {i == environments.length - 1 ? (
                    <button
                      onClick={() => {
                        setEnvironments([
                          ...environments,
                          {
                            key: "",
                            value: "",
                          },
                        ]);
                      }}
                      className="btn btn-circle btn-sm"
                      style={{ background: "#0285FF", borderColor: "#0285FF" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 19C11.7167 19 11.4793 18.904 11.288 18.712C11.096 18.5207 11 18.2833 11 18V13H6C5.71667 13 5.479 12.904 5.287 12.712C5.09567 12.5207 5 12.2833 5 12C5 11.7167 5.09567 11.479 5.287 11.287C5.479 11.0957 5.71667 11 6 11H11V6C11 5.71667 11.096 5.479 11.288 5.287C11.4793 5.09567 11.7167 5 12 5C12.2833 5 12.521 5.09567 12.713 5.287C12.9043 5.479 13 5.71667 13 6V11H18C18.2833 11 18.5207 11.0957 18.712 11.287C18.904 11.479 19 11.7167 19 12C19 12.2833 18.904 12.5207 18.712 12.712C18.5207 12.904 18.2833 13 18 13H13V18C13 18.2833 12.9043 18.5207 12.713 18.712C12.521 18.904 12.2833 19 12 19Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEnvironments(
                          environments.filter((_, index) => index != i)
                        );
                      }}
                      className="btn btn-circle btn-sm"
                      style={{ background: "#ff4135", borderColor: "#ff4135" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 12.998H6C5.73478 12.998 5.48043 12.8926 5.29289 12.7051C5.10536 12.5176 5 12.2632 5 11.998C5 11.7328 5.10536 11.4784 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4784 19 11.7328 19 11.998C19 12.2632 18.8946 12.5176 18.7071 12.7051C18.5196 12.8926 18.2652 12.998 18 12.998Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <hr />
            <h1 className="px-2 mt-3" style={{ fontSize: 14 }}>
              Volume Mapping
            </h1>
            {volumes.map((volume, i) => (
              <div key={"v" + i} className="flex flex-wrap items-center">
                <div className="p-2 w-1/4">
                  <input
                    placeholder="Source"
                    value={volume.source}
                    onChange={(e) => {
                      const newVols = [...volumes];
                      newVols[i]["source"] = e.target.value;
                      setVolumes(newVols);
                    }}
                    type="text"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div className="p-2 w-1/4">
                  <input
                    placeholder="Destination"
                    value={volume.destination}
                    onChange={(e) => {
                      const newVols = [...volumes];
                      newVols[i]["destination"] = e.target.value;
                      setVolumes(newVols);
                    }}
                    type="text"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div className="p-2 flex items-center">
                  {i == volumes.length - 1 ? (
                    <button
                      onClick={() => {
                        setVolumes([
                          ...volumes,
                          {
                            source: "",
                            destination: "",
                          },
                        ]);
                      }}
                      className="btn btn-circle btn-sm"
                      style={{ background: "#0285FF", borderColor: "#0285FF" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 19C11.7167 19 11.4793 18.904 11.288 18.712C11.096 18.5207 11 18.2833 11 18V13H6C5.71667 13 5.479 12.904 5.287 12.712C5.09567 12.5207 5 12.2833 5 12C5 11.7167 5.09567 11.479 5.287 11.287C5.479 11.0957 5.71667 11 6 11H11V6C11 5.71667 11.096 5.479 11.288 5.287C11.4793 5.09567 11.7167 5 12 5C12.2833 5 12.521 5.09567 12.713 5.287C12.9043 5.479 13 5.71667 13 6V11H18C18.2833 11 18.5207 11.0957 18.712 11.287C18.904 11.479 19 11.7167 19 12C19 12.2833 18.904 12.5207 18.712 12.712C18.5207 12.904 18.2833 13 18 13H13V18C13 18.2833 12.9043 18.5207 12.713 18.712C12.521 18.904 12.2833 19 12 19Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setVolumes(volumes.filter((_, index) => index != i));
                      }}
                      className="btn btn-circle btn-sm"
                      style={{ background: "#ff4135", borderColor: "#ff4135" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 12.998H6C5.73478 12.998 5.48043 12.8926 5.29289 12.7051C5.10536 12.5176 5 12.2632 5 11.998C5 11.7328 5.10536 11.4784 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4784 19 11.7328 19 11.998C19 12.2632 18.8946 12.5176 18.7071 12.7051C18.5196 12.8926 18.2652 12.998 18 12.998Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {activeMenu == "overview" && status == "deploy" ? (
          <div
            id={`deploy_${containerId}`}
            className="log-view card-body bg-black text-white rounded-xl overflow-y-auto"
            style={{ height: 600 }}
          >
            <pre className="text-white text-xl"></pre>
          </div>
        ) : null}
        {activeMenu == "version" ? (
          <div
            style={{ fontSize: 13 }}
            className="bg-white rounded-xl shadow-lg overflow-auto raised-rounded-card"
          >
            <table className="w-full h-full table">
              <thead className="font-bold" style={{ fontSize: 14 }}>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-left">Version</th>
                  <th className="text-left">Time</th>
                  <th className="text-left">Active</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {versions.map((v, i) => (
                  <tr key={v._id}>
                    <td className="text-center">{i + 1}</td>
                    <td>{v.version}</td>
                    <td>{moment(v.createdAt).fromNow()}</td>
                    <td>{v.version == version ? "Yes" : "No"}</td>
                    {/* <td>
                      <button
                        className="btn"
                        style={{
                          borderRadius: "2rem",
                          textTransform: "none",
                          background: "#0285FF",
                          borderColor: "#0285FF",
                        }}
                      >
                        Change Version
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {activeMenu == "log" ? (
          <div
            id={`log_${containerId}`}
            className="card-body bg-black text-white rounded-xl overflow-y-auto"
            style={{ height: 600 }}
          >
            <pre className="text-white text-xl"></pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      appref: context.query.ref,
    }, // will be passed to the page component as props
  };
}
