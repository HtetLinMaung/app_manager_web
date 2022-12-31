import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import http from "starless-http";
import Swal from "sweetalert2";
import BreadCrumb from "../../../../components/BreadCrumb";
import TextInput from "../../../../components/TextInput";
import { domain } from "../../../../constants";

export default function Application({ appref }) {
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
  const [git, setGit] = useState("");
  const [port, setPort] = useState("");
  const [deployment, setDeployment] = useState("");
  const [environments, setEnvironments] = useState({});
  const [volumes, setVolumes] = useState([]);

  const [deployments, setDeployments] = useState([]);

  const fetchDeployments = async () => {
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
    if (err || response.status != 200) {
      return Swal.fire({
        icon: "error",
        message: response.data
          ? response.data.message
          : "Something went wrong!",
      });
    }
    setDeployments(
      response.data.data.map((d) => ({
        key: d._id,
        value: d._id,
        label: `${d.name} (${d.version})`,
      }))
    );
    if (response.data.data.length) {
      setDeployment(response.data.data[0]._id);
    }
  };

  const fetchData = async () => {
    const [response, err] = await http.get(`${domain}/applications/${appref}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (err || response.status != 200) {
      return Swal.fire({
        icon: "error",
        message: response.data
          ? response.data.message
          : "Something went wrong!",
      });
    }
    const { ref, name, version, git, port, deployment, volumes } =
      response.data.data;
    setRef(ref);
    setName(name);
    setVersion(version);
    setGit(git);
    setPort(port);
    setDeployment(deployment);
    setVolumes(volumes);
  };

  useEffect(() => {
    fetchDeployments();
    if (ref != "new") {
      fetchData();
    } else {
      setRef(appref);
      setName("");
      setVersion("");
      setGit("");
      setPort("");
      setDeployment("");
      setVolumes([]);
    }
  }, []);

  return (
    <div className="p-10 md:ml-20 mb-20 m-0">
      <div className="mb-5">
        <BreadCrumb items={bItems} />
      </div>
      <div className="card shadow-xl bg-white">
        <div className="card-body">
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
                Version
              </div>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                type="text"
                className="input input-bordered w-full rounded-xl"
              />
            </div>
            <div className="p-2 w-1/4">
              <div className="mb-2" style={{ fontSize: 14 }}>
                Port
              </div>
              <input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                type="text"
                className="input input-bordered w-full rounded-xl"
              />
            </div>
            <div className="p-2 flex-grow">
              <div className="mb-2" style={{ fontSize: 14 }}>
                Deployment
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
          </div>
          <div className="flex flex-wrap mb-3 w-1/2">
            <div className="p-2 flex-grow">
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
          </div>
          {/* <div className="flex flex-wrap mb-3 w-1/6">
            <div className="p-2 flex-grow ">
              <div className="mb-2" style={{ fontSize: 14 }}>
                Port
              </div>
              <TextInput value={git} onChange={(e) => setGit(e.target.value)} />
            </div>
          </div> */}
        </div>
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
