export default function Modal({
  open,
  children,
  minWidth = 500,
  onOverlayClick,
  width = 500,
}) {
  const className = `fixed flex justify-center items-center h-screen w-screen top-0 left-0 z-50  transition ease-in-out ${
    !open ? "scale-0" : "scale-100"
  } `;

  return (
    <div className={className} onClick={onOverlayClick}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="raised-rounded-card rounded-2xl p-10 overflow-auto"
        style={{ minWidth, width, maxHeight: "90%" }}
      >
        {children}
      </div>
    </div>
  );
}
