export default function Checkbox({ checked, onChange = () => {} }) {
  return (
    <input
      type="checkbox"
      className="rounded-3xl"
      checked={checked}
      onChange={onChange}
    />
  );
}
