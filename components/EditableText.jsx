import { useState } from "react";
import money from "mm-money";

export default function EditablePrice({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <div className="">
      {isEditing ? (
        <input
          value={value}
          onChange={onChange}
          onBlur={toggleEditing}
          type="number"
          className="outline-none text-right bg-transparent transition ease-in-out"
        />
      ) : (
        <input
          onFocus={toggleEditing}
          readOnly
          value={money.format(value)}
          type="text"
          className="outline-none bg-transparent text-right transition ease-in-out"
        />
      )}
    </div>
  );
}
