import { useState } from "react";
import money from "mm-money";

export default function PriceInput({
  style,
  placeholder,
  value = "0.00",
  onChange = () => {},
  onKeyDown = () => {},
}) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <div
      className="rounded-xl overflow-hidden transition ease-in-out flex "
      style={{
        borderWidth: 1,
        borderColor: isEditing ? "#60A5FA" : "#D1D5DB",
      }}
    >
      <div
        className="px-4 border-gray-300 flex justify-center items-center"
        style={{ borderRightWidth: 1, backgroundColor: "#F8FAFB" }}
      >
        Ks
      </div>

      <div className="flex-grow">
        {isEditing ? (
          <input
            onKeyDown={onKeyDown}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={toggleEditing}
            type="number"
            className="outline-none py-2 px-6 rounded-xl h-full w-full placeholder:text-sm transition ease-in-out"
            style={{ ...style, fontSize: 14 }}
          />
        ) : (
          <input
            onFocus={toggleEditing}
            readOnly
            value={money.format(value)}
            type="text"
            className="outline-none py-2 px-6 rounded-xl h-full w-full placeholder:text-sm transition ease-in-out"
            style={{ ...style, fontSize: 14 }}
          />
        )}
      </div>
    </div>
  );
}
