export default function TextArea({ style, value, onChange, minHeight }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className="outline-none py-3 px-6 w-full rounded-xl placeholder:text-sm focus:border-blue-400  border-gray-300 transition ease-in-out"
      style={{ ...style, fontSize: 14, borderWidth: 1, minHeight }}
    ></textarea>
  );
}
