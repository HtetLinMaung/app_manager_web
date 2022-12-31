import { useRouter } from "next/router";
import { useContext } from "react";
import { appContext } from "../provider/AppProvider";

export default function SideBar() {
  const [state, dispatch] = useContext(appContext);
  const router = useRouter();

  return (
    <nav
      className="md:w-20 fixed w-screen bottom-0 md:top-0 left-0 flex flex-col md:h-screen raised-rounded-card z-50 flex-shrink-0 overflow-auto"
      style={{ borderRadius: 0 }}
    >
      <div></div>
      <ul className="md:py-16 px-16 md:px-0 h-20 flex md:flex-col flex-grow">
        <li className="flex justify-center mr-10 md:mr-0 md:mb-10">
          <svg
            onClick={() => router.push("/app-manager")}
            style={{
              width: "1.5rem",
              color: router.pathname == "/app-manager" ? "#0285FF" : "#9A999B",
            }}
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="chart-pie"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 544 512"
            className="svg-inline--fa fa-chart-pie fa-w-17 fa-3x cursor-pointer"
          >
            <path
              fill="currentColor"
              d="M527.79 288H290.5l158.03 158.03c6.04 6.04 15.98 6.53 22.19.68 38.7-36.46 65.32-85.61 73.13-140.86 1.34-9.46-6.51-17.85-16.06-17.85zm-15.83-64.8C503.72 103.74 408.26 8.28 288.8.04 279.68-.59 272 7.1 272 16.24V240h223.77c9.14 0 16.82-7.68 16.19-16.8zM224 288V50.71c0-9.55-8.39-17.4-17.84-16.06C86.99 51.49-4.1 155.6.14 280.37 4.5 408.51 114.83 513.59 243.03 511.98c50.4-.63 96.97-16.87 135.26-44.03 7.9-5.6 8.42-17.23 1.57-24.08L224 288z"
              className="fa-primary"
            ></path>
          </svg>
        </li>

        <li className="flex justify-center mr-10 md:mr-0 md:mb-10">
          <svg
            onClick={() => router.push("/app-manager/applications")}
            style={{
              width: "1.8rem",
              color: router.pathname.includes("/app-manager/applications")
                ? "#0285FF"
                : "#9A999B",
            }}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
          >
            <path
              d="M41 14L24 4L7 14V34L24 44L41 34V14Z"
              stroke={
                router.pathname.includes("/app-manager/applications")
                  ? "#0285FF"
                  : "#9A999B"
              }
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M16 18.998L23.993 24L31.995 18.998M24 24V33"
              stroke={
                router.pathname.includes("/app-manager/applications")
                  ? "#0285FF"
                  : "#9A999B"
              }
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </li>
        <li className="flex-grow"></li>
        <li className="flex justify-center items-center" title="Logout">
          <svg
            onClick={() => {
              localStorage.setItem("token", "");
              // disconnectSocket();
              router.push("/app-manager/login");
            }}
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color:
                router.pathname == "/app-manager/login" ? "#0285FF" : "#9A999B",
            }}
            width="1024"
            height="1024"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
          >
            <path
              d="M868 732H797.7C792.9 732 788.4 734.1 785.4 737.8C778.4 746.3 770.9 754.5 763 762.3C730.689 794.643 692.417 820.418 650.3 838.2C606.666 856.63 559.767 866.085 512.4 866C464.5 866 418.1 856.6 374.5 838.2C332.383 820.418 294.111 794.643 261.8 762.3C229.432 730.066 203.622 691.861 185.8 649.8C167.3 606.2 158 559.9 158 512C158 464.1 167.4 417.8 185.8 374.2C203.6 332.1 229.2 294.2 261.8 261.7C294.4 229.2 332.3 203.6 374.5 185.8C418.1 167.4 464.5 158 512.4 158C560.3 158 606.7 167.3 650.3 185.8C692.5 203.6 730.4 229.2 763 261.7C770.9 269.6 778.3 277.8 785.4 286.2C788.4 289.9 793 292 797.7 292H868C874.3 292 878.2 285 874.7 279.7C798 160.5 663.8 81.6 511.3 82C271.7 82.6 79.6 277.1 82 516.4C84.4 751.9 276.2 942 512.4 942C664.5 942 798.1 863.2 874.7 744.3C878.1 739 874.3 732 868 732ZM956.9 505.7L815 393.7C809.7 389.5 802 393.3 802 400V476H488C483.6 476 480 479.6 480 484V540C480 544.4 483.6 548 488 548H802V624C802 630.7 809.8 634.5 815 630.3L956.9 518.3C957.856 517.552 958.63 516.595 959.161 515.504C959.693 514.412 959.969 513.214 959.969 512C959.969 510.786 959.693 509.588 959.161 508.496C958.63 507.404 957.856 506.448 956.9 505.7V505.7Z"
              fill="#9A999B"
            />
          </svg>
        </li>
      </ul>
    </nav>
  );
}
