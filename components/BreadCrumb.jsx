import { useRouter } from "next/router";

export default function BreadCrumb({ items }) {
  const router = useRouter();

  return (
    <ul className="flex" style={{ height: 36 }}>
      {items.map((item, index) => (
        <li
          onClick={() => router.push(item.to)}
          key={index}
          className={`text-xl font-bold pr-5 flex items-center ${
            index != items.length - 1 ? "cursor-pointer underline" : ""
          }`}
          style={{ color: index != items.length - 1 ? "#0285FF" : "#000" }}
        >
          {item.label}
          {index != items.length - 1 ? (
            <span className="pl-5">
              <svg
                style={{ width: "1.5rem" }}
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.48 29.52L25.4 18L13.48 6.47999C13.1551 6.16704 12.7192 5.99596 12.2682 6.0044C11.8172 6.01284 11.388 6.2001 11.075 6.52499C10.7621 6.84988 10.591 7.28579 10.5994 7.73681C10.6079 8.18784 10.7951 8.61704 11.12 8.92999L20.51 18L11.12 27.08C10.7951 27.3929 10.6079 27.8221 10.5994 28.2732C10.591 28.7242 10.7621 29.1601 11.075 29.485C11.388 29.8099 11.8172 29.9971 12.2682 30.0056C12.7192 30.014 13.1551 29.843 13.48 29.53V29.52Z"
                  fill="#9A999B"
                />
              </svg>
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
