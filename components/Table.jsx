import RaisedCombo from "./RaisedCombo";

const perpages = [
  {
    text: "10",
    value: "10",
  },
  {
    text: "20",
    value: "20",
  },
  {
    text: "30",
    value: "30",
  },
  {
    text: "40",
    value: "40",
  },
  {
    text: "50",
    value: "50",
  },
  {
    text: "60",
    value: "60",
  },
  {
    text: "70",
    value: "70",
  },
  {
    text: "80",
    value: "80",
  },
  {
    text: "90",
    value: "90",
  },
  {
    text: "100",
    value: "100",
  },
];

export default function Table({
  headers,
  items = [],
  pagination = { page: 1, perpage: 10, pagecount: 1 },
  onPaginationChange = () => {},
  onEditClick = () => {},
  onDeleteClick = () => {},
  totalCounts = 0,
  countLabel = "",
  colStyles = {},
  colEvents = {},
  hideAction = false,
  hidePagination = false,
}) {
  const keys = headers.map((header) => header.key);

  return (
    <div>
      <div
        style={{ fontSize: 13 }}
        className="bg-white rounded-xl shadow-lg overflow-auto raised-rounded-card"
      >
        <table className="w-full h-full table">
          <thead className="font-bold" style={{ fontSize: 14 }}>
            <tr>
              <th className="">#</th>
              {headers.map((header) => (
                <th key={header.key} className="text-left">
                  {header.title}
                </th>
              ))}
              {hideAction ? null : <th></th>}
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((item, index) => (
                <tr key={item._id}>
                  <td className="text-center">
                    {index + 1 + pagination.perpage * (pagination.page - 1)}
                  </td>
                  {keys.map((key) => (
                    <td
                      key={key}
                      style={key in colStyles ? colStyles[key] : {}}
                      onClick={
                        key in colEvents
                          ? (e) => colEvents[key]["onClick"](e, item)
                          : () => {}
                      }
                    >
                      {item[key]}
                    </td>
                  ))}
                  {hideAction ? null : (
                    <td>
                      <div className="flex justify-around items-center">
                        <svg
                          onClick={() => onEditClick(item._id)}
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="pencil-alt"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="svg-inline--fa fa-pencil-alt fa-w-16 fa-3x cursor-pointer"
                          style={{ width: "1rem" }}
                        >
                          <path
                            fill="currentColor"
                            d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"
                            className=""
                            style={{ color: "grey" }}
                          ></path>
                        </svg>
                        <svg
                          onClick={() => onDeleteClick(item._id)}
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="trash"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="svg-inline--fa fa-trash fa-w-14 fa-3x cursor-pointer"
                          style={{ width: "1rem" }}
                        >
                          <path
                            fill="currentColor"
                            d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
                            className=""
                            style={{ color: "grey" }}
                          ></path>
                        </svg>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center" colSpan={keys.length + 2}>
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {hidePagination ? null : (
        <div className="flex flex-wrap justify-end my-5">
          <div className="mr-0 sm:mr-4 py-2 mb-5 sm:mb-0 w-full sm:w-auto raised-rounded-card px-5 flex items-center justify-center">
            {totalCounts}{" "}
            {countLabel.endsWith("y") && totalCounts > 1
              ? countLabel.slice(0, countLabel.length - 1)
              : countLabel}
            {totalCounts > 1 ? (countLabel.endsWith("y") ? "ies" : "s") : ""}
          </div>
          <div className="mb-5 sm:mb-0 w-full sm:px-4 sm:w-1/3 md:w-1/6 ">
            <div
              className="flex justify-around items-center p-1 raised-rounded-card active:border-blue-400 transition ease-in-out"
              style={{ borderWidth: 1 }}
            >
              <svg
                onClick={() =>
                  onPaginationChange({
                    ...pagination,
                    page: 1,
                  })
                }
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-double-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg-inline--fa fa-angle-double-left fa-w-14 fa-3x"
                style={{ width: "1.3rem" }}
              >
                <path
                  fill="currentColor"
                  d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"
                  className=""
                  style={{ color: "grey" }}
                ></path>
              </svg>
              <svg
                onClick={() => {
                  if (pagination.page > 1) {
                    onPaginationChange({
                      ...pagination,
                      page: pagination.page - 1,
                    });
                  }
                }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
                className="svg-inline--fa fa-angle-left fa-w-8 fa-3x"
                style={{ width: "1rem", padding: "0.1rem" }}
              >
                <path
                  fill="currentColor"
                  d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"
                  className=""
                  style={{ color: "grey" }}
                ></path>
              </svg>
              <span className="font-bold">
                {pagination.page} : {pagination.pagecount}
              </span>
              <svg
                onClick={() => {
                  if (pagination.page < pagination.pagecount) {
                    onPaginationChange({
                      ...pagination,
                      page: pagination.page + 1,
                    });
                  }
                }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-right"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
                className="svg-inline--fa fa-angle-right fa-w-8 fa-3x"
                style={{ width: "1rem", padding: "0.1rem" }}
              >
                <path
                  fill="currentColor"
                  d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
                  className=""
                  style={{ color: "grey" }}
                ></path>
              </svg>
              <svg
                onClick={() => {
                  onPaginationChange({
                    ...pagination,
                    page: pagination.pagecount,
                  });
                }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="angle-double-right"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg-inline--fa fa-angle-double-right fa-w-14 fa-3x"
                style={{ width: "1.3rem" }}
              >
                <path
                  fill="currentColor"
                  d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"
                  className=""
                  style={{ color: "grey" }}
                ></path>
              </svg>
            </div>
          </div>

          <div className="sm:pl-4 w-full sm:w-auto">
            <RaisedCombo
              value={pagination.perpage}
              items={perpages}
              onChange={(e) =>
                onPaginationChange({
                  ...pagination,
                  perpage: e.target.value,
                  page: 1,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
