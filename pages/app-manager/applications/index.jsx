import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useContext, useState, useEffect } from "react";
import moment from "moment";
import TextInput from "../../../components/TextInput";
import Swal from "sweetalert2";
import Table from "../../../components/Table";
import RaisedInput from "../../../components/RaisedInput";
import IconButton from "../../../components/IconButton";
import BreadCrumb from "../../../components/BreadCrumb";
import { useRouter } from "next/router";
import SelectDateButton from "../../../components/SelectDateButton";
import SortButton from "../../../components/SortButton";
import Checkbox from "../../../components/Checkbox";
import http from "starless-http";
import { appContext } from "../../../provider/AppProvider";
import { domain } from "../../../constants";

export default function Application() {
  const router = useRouter();
  const [state, dispatch] = useContext(appContext);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [tableHeaders, setTableHeaders] = useState([
    {
      key: "ref",
      title: "Ref.",
    },
    {
      key: "name",
      title: "Name",
    },
    {
      key: "version",
      title: "Version",
    },
    {
      key: "port",
      title: "Port",
    },
    {
      key: "deploymentname",
      title: "Deployment",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "createdAt",
      title: "Time",
    }, // {
    //   key: "creatername",
    //   title: "Creater",
    // },
  ]);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perpage: 50,
    pagecount: 1,
  });
  const [totalCounts, setTotalCounts] = useState(0);
  const [search, setSearch] = useState("");
  const [dateModal, setDateModal] = useState(false);
  const [datelabel, setDatelabel] = useState("Select Dates");
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [sortModal, setSortModal] = useState(false);

  useEffect(() => {
    fetchTableData();
  }, [
    pagination.page,
    pagination.perpage,
    search,
    state.sortItems["Application"],
  ]);

  //   useEffect(() => {
  //     const socket = getSocket();
  //     socket.on("Application:create", fetchTableData);
  //     socket.on("Application:update", fetchTableData);
  //     socket.on("Application:delete", fetchTableData);
  //   }, []);

  const fetchTableData = async () => {
    setTableData([]);
    dispatch({ type: "SET_STATE", payload: { loading: true } });
    const [response, err] = await http.get(`${domain}/applications`, {
      params: {
        ...pagination,
        search,
        populate: "deployment",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch({ type: "SET_STATE", payload: { loading: false } });
    if (err || response.status != 200) {
      return Swal.fire({
        icon: "error",
        text: response.data ? response.data.message : "Something went wrong!",
      });
    }
    setTableData(
      response.data.data.map((d) => ({
        ...d,
        // creatername: d.createdby.name,
        createdAt: moment(d.createdAt).format("DD/MM/YYYY, h:mm:ss a"),
      }))
    );
    setPagination({ ...pagination, pagecount: response.data.pagecount });
    setTotalCounts(response.data.total);
  };

  const dateModalClear = () => {
    setFromdate("");
    setTodate("");
  };

  const dateModalOk = () => {
    if (fromdate && !todate) {
      setDatelabel(`>= ${moment(fromdate).format("DD/MM/YY")}`);
    } else if (todate && fromdate) {
      if (fromdate == todate) {
        setDatelabel(`${moment(fromdate).format("DD/MM/YY")}`);
      } else {
        setDatelabel(
          `${moment(fromdate).format("DD/MM/YY")} - ${moment(todate).format(
            "DD/MM/YY"
          )}`
        );
      }
    } else if (!fromdate && todate) {
      setDatelabel(`<= ${moment(todate).format("DD/MM/YY")}`);
    } else {
      setDatelabel("Select Dates");
    }
    setDateModal(false);
    fetchTableData();
  };

  const sortModalOk = () => {
    setSortModal(false);
    fetchTableData();
  };

  const handleDelete = () => {};

  return (
    <div className="p-10 md:ml-20 mb-20 m-0">
      <Modal
        open={sortModal}
        minWidth={280}
        width={300}
        onOverlayClick={sortModalOk}
      >
        <ul>
          {state.sortItems["Application"].map((item) => (
            <li key={item.key} className="flex items-center mb-3">
              <Checkbox
                checked={item.checked}
                onChange={(e) => {
                  const m = { ...state.sortItems };
                  m["Application"] = m["Application"].map((si) =>
                    si.key == item.key ? { ...si, checked: !si.checked } : si
                  );
                  dispatch({ type: "SET_STATE", payload: { sortItems: m } });
                }}
              />
              <span className="ml-3">{item.title}</span>
              <div className="flex-grow"></div>
              <svg
                onClick={() => {
                  const m = { ...state.sortItems };
                  m["Application"] = m["Application"].map((si) =>
                    si.key == item.key
                      ? { ...si, order: si.order == "asc" ? "desc" : "asc" }
                      : si
                  );
                  dispatch({ type: "SET_STATE", payload: { sortItems: m } });
                }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fal"
                data-icon="arrow-down"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg-inline--fa fa-arrow-down fa-w-14 fa-3x sort-icon cursor-pointer transition ease-in-out"
                style={{
                  width: "0.8rem",
                  transform:
                    item.order == "desc" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  fill="currentColor"
                  d="M443.5 248.5l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L241 419.9V44c0-6.6-5.4-12-12-12h-10c-6.6 0-12 5.4-12 12v375.9L28.5 241.4c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.8 4.8-12.3.1-17z"
                ></path>
              </svg>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal
        open={dateModal}
        minWidth={280}
        width={350}
        onOverlayClick={dateModalOk}
      >
        <div className="mb-3">
          <div className="mb-2" style={{ fontSize: 14 }}>
            From
          </div>
          <TextInput
            py="2"
            type="date"
            value={fromdate}
            onChange={(e) => setFromdate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="mb-2" style={{ fontSize: 14 }}>
            To
          </div>
          <TextInput
            py="2"
            type="date"
            value={todate}
            onChange={(e) => setTodate(e.target.value)}
          />
        </div>
        <div className="mt-10 flex justify-around">
          <div className="w-1/3">
            <Button block onClick={dateModalClear}>
              Clear
            </Button>
          </div>
          <div className="w-1/3">
            <Button block onClick={dateModalOk}>
              Ok
            </Button>
          </div>
        </div>
      </Modal>
      <div className="mb-5">
        <BreadCrumb
          items={[
            {
              label: "Dashboard",
              to: "/app-manager",
            },
            {
              label: "Application",
              to: "/app-manager/applications",
            },
          ]}
        />
      </div>
      <div className="flex flex-wrap mb-5">
        <div className="flex-grow"></div>
        {/* <div className="w-full sm:w-auto">
          <DownloadButton
            label="Export"
            url={`${host}/sayin/products/export?token=${
              state.token
            }&search=${search}&sort=${sortItems
              .filter((si) => si.checked)
              .map((si) => `${si.key}:${si.order}`)
              .join(",")}&fromdate=${fromdate}&todate=${todate}`}
          />
        </div>
        <div className="px-3">
          <UploadButton
            label="Import"
            loading={upoloadLoading}
            onFilePicked={handleImport}
          />
        </div> */}
        <Button onClick={() => router.push("/app-manager/applications/new")}>
          Add Application
        </Button>
      </div>
      <div className="flex mb-5 items-center flex-wrap">
        <div className="w-full mb-3 md:w-auto md:mb-0">
          <RaisedInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="svg-inline--fa fa-search fa-w-16 fa-3x"
              style={{ width: "1rem" }}
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                className=""
                style={{ color: "grey" }}
              ></path>
            </svg>
          </RaisedInput>
        </div>
        <div className="md:ml-3 w-full mb-3 md:w-auto md:mb-0">
          <SelectDateButton
            block
            label={datelabel}
            onClick={() => setDateModal(true)}
          />
        </div>
        <div className="md:ml-3 w-full mb-3 md:w-auto md:mb-0">
          <SortButton block onClick={() => setSortModal(true)} />
        </div>
        <div className="md:mx-3 w-full mb-3 md:w-auto md:mb-0">
          <IconButton>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="filter"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="svg-inline--fa fa-filter fa-w-16 fa-3x __svg"
              style={{ width: "1rem" }}
            >
              <path
                fill="currentColor"
                d="M463.952 0H48.057C5.419 0-16.094 51.731 14.116 81.941L176 243.882V416c0 15.108 7.113 29.335 19.2 40l64 47.066c31.273 21.855 76.8 1.538 76.8-38.4V243.882L497.893 81.941C528.042 51.792 506.675 0 463.952 0zM288 224v240l-64-48V224L48 48h416L288 224z"
              ></path>
            </svg>
          </IconButton>
        </div>
        <div className="flex-grow"></div>
      </div>
      <Table
        pagination={pagination}
        onPaginationChange={setPagination}
        headers={tableHeaders}
        items={tableData}
        hideAction
        totalCounts={totalCounts}
        countLabel="Application"
        colStyles={{
          ref: {
            cursor: "pointer",
            textDecoration: "underline",
            color: "#0285ff",
          },
        }}
        colEvents={{
          ref: {
            onClick: (e, item) => {
              router.push(`/app-manager/applications/${item.ref}`);
            },
          },
        }}
      ></Table>
    </div>
  );
}
