export default function IconButton({
  children,
  onClick,
  size = 30,
  color,
  flat = false,
}) {
  const className = `${
    flat ? "" : "raised-rounded-card"
  } rounded-full flex justify-center items-center active:scale-90 transition ease-in-out `;
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        width: size,
        height: size,
        padding: 0,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    >
      {children}
    </button>
  );
}
