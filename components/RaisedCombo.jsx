export default function RaisedCombo({
  value,
  onChange = () => {},
  items = [],
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="raised-rounded-card py-1 h-full px-6 w-full outline-none transition ease-in-out focus:border-blue-400"
      style={{ borderWidth: 1 }}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.text}
        </option>
      ))}
    </select>
  );
}
