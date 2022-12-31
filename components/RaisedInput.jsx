export default function RaisedInput({
  iconPosition = "right",
  style,
  placeholder,
  value,
  onChange = () => {},
  type = "text",
  onKeyDown = () => {},
  children,
}) {
  return (
    <div
      className="raised-rounded-card overflow-hidden transition ease-in-out focus:border-blue-400 flex items-center"
      style={{ borderWidth: 1 }}
    >
      {iconPosition === "left" && <div className="px-4">{children}</div>}
      <input
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="outline-none py-2 px-6 w-full placeholder:text-sm focus:border-blue-400 transition ease-in-out"
        style={{ ...style, fontSize: 13 }}
      />
      {iconPosition === "right" && <div className="px-4">{children}</div>}
    </div>
  );
}
