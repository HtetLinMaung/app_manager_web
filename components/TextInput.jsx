export default function TextInput({
  style,
  placeholder,
  value,
  onChange = () => {},
  type = "text",
  onKeyDown = () => {},
  py = "2",
}) {
  return (
    <div>
      <input
        onKeyDown={onKeyDown}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`outline-none py-${py} px-6 w-full rounded-xl placeholder:text-sm focus:border-blue-400  border-gray-300 transition ease-in-out`}
        style={{ ...style, fontSize: 14, borderWidth: 1 }}
      />
    </div>
  );
}
