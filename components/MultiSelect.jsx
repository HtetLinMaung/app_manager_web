import { useState, useEffect } from "react";
export default function MultiSelect({
  value = [],
  onSelected = () => {},
  items = [],
  style = {},
  placeholder = "",
}) {
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    setNewItems(items.map((item) => ({ ...item, checked: false })));
  }, [items]);

  useEffect(() => {
    if (!value.length) {
      setNewItems(items.map((item) => ({ ...item, checked: false })));
    } else {
      setNewItems(
        items.map((item) => ({ ...item, checked: value.includes(item.value) }))
      );
    }
  }, [value]);

  return (
    <div className="dropdown w-full">
      <div
        style={{ ...style, fontSize: 14, borderWidth: 1, minHeight: "36.5px" }}
        tabIndex="0"
        className="focus:border-blue-400  border-gray-300 rounded-xl py-2 px-6 transition ease-in-out flex overflow-hidden"
      >
        {value.length
          ? newItems
              .filter((item) => item.checked)
              .map((item) => (
                <div key={item.value} className="badge badge-lg mr-2 text-sm">
                  {item.text}
                </div>
              ))
          : placeholder}
      </div>
      <ul
        tabIndex="0"
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full"
      >
        {newItems.map((item, i) => (
          <li key={item.value}>
            <a className="flex">
              <input
                type="checkbox"
                value={item.checked}
                onChange={(e) => {
                  const list = [...newItems];
                  list[i].checked = e.target.checked;
                  setNewItems(list);
                  onSelected(
                    newItems
                      .filter((item) => item.checked)
                      .map((item) => item.value)
                  );
                }}
              />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
