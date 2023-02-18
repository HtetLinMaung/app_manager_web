export default function ProductCard({
  image,
  name,
  description,
  price,
  onClick,
  nettprice,
  reorderlevel,
  instock,
}) {
  const ProductStatus = () => {
    if (instock <= 0) {
      return (
        <div className="bg-red-500 py-1 px-2 text-white rounded-xl text-sm">
          Out of stock
        </div>
      );
    } else if (instock <= reorderlevel) {
      return (
        <div className="bg-orange-500 py-1 px-2 text-white rounded-xl text-sm">
          Only {instock} {instock > 1 ? "items" : "item"} left
        </div>
      );
    }
    return null;
  };

  return (
    <div className="raised-rounded-card p-4 cursor-pointer" onClick={onClick}>
      <img
        className="rounded-xl"
        style={{ width: "100%", height: 200 }}
        src={image}
        alt="image"
      />

      <div className="font-bold text-xl my-5">{name}</div>
      <div
        className="overflow-hidden mb-5"
        style={{ height: 44, color: "#9C9C9C" }}
      >
        {description}
      </div>
      <div className="flex justify-between">
        <span className="text-lg" style={{ color: "#0285FF" }}>
          {nettprice} Ks
        </span>
        <ProductStatus />
      </div>
    </div>
  );
}
