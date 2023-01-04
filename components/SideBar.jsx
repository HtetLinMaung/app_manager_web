import { useRouter } from "next/router";
import { useContext } from "react";
import { appContext } from "../provider/AppProvider";
import { disconnectSocket } from "../utils/socket";

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

        <li className="flex justify-center mr-10 md:mr-0 md:mb-14">
          <svg
            onClick={() => router.push("/app-manager/containers")}
            style={{
              width: "1.8rem",
              color: router.pathname.includes("/app-manager/containers")
                ? "#0285FF"
                : "#9A999B",
            }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_324_2)">
              <path
                d="M13.152 0.681999C13.4964 0.481074 13.8879 0.375198 14.2865 0.375198C14.6852 0.375198 15.0767 0.481074 15.421 0.681999L15.428 0.685999L22.385 4.962C22.7277 5.16274 23.0119 5.44962 23.2094 5.79415C23.4069 6.13867 23.5109 6.52887 23.511 6.926V14.442C23.511 15.252 23.079 16.002 22.378 16.41L22.376 16.411L10.412 23.448L10.408 23.451C9.70202 23.861 8.83002 23.861 8.12402 23.451L8.09802 23.436L1.59502 18.934C1.2604 18.732 0.983651 18.447 0.791622 18.1066C0.599593 17.7661 0.498802 17.3819 0.499024 16.991V9.438C0.499024 9.046 0.599024 8.668 0.783024 8.338L0.786024 8.332L0.800024 8.306C0.997024 7.964 1.28002 7.679 1.62002 7.479H1.62202L13.152 0.680999V0.681999ZM13.909 1.977H13.908L2.64802 8.616L8.89602 12.863C9.01265 12.9264 9.1436 12.9588 9.27633 12.957C9.40906 12.9553 9.53911 12.9194 9.65402 12.853H9.65502L21.288 6.049L14.659 1.975C14.5447 1.90963 14.4153 1.87549 14.2836 1.87602C14.152 1.87654 14.0228 1.91172 13.909 1.978V1.977ZM8.51702 14.33C8.38063 14.2825 8.24904 14.2223 8.12402 14.15L8.10102 14.136L1.99902 9.989V16.992C1.99902 17.267 2.14402 17.52 2.37802 17.656L2.40302 17.67L8.51702 21.902V14.33ZM18 9.709L14.75 11.609V19.157L18 17.245V9.709ZM10.41 14.147L10.408 14.149C10.2836 14.2211 10.1527 14.2814 10.017 14.329V21.941L13.25 20.039V12.487L10.41 14.147ZM19.5 8.831V16.363L21.624 15.113C21.7417 15.0449 21.8393 14.947 21.9072 14.8292C21.9752 14.7115 22.0109 14.5779 22.011 14.442V7.363L19.5 8.831Z"
                fill={
                  router.pathname.includes("/app-manager/containers")
                    ? "#0285FF"
                    : "#9A999B"
                }
              />
            </g>
            <defs>
              <clipPath id="clip0_324_2">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </li>

        <li className="flex justify-center mr-10 md:mr-0 md:mb-10">
          <svg
            onClick={() => router.push("/app-manager/deployments")}
            style={{
              width: "1.8rem",
              color: router.pathname.includes("/app-manager/deployments")
                ? "#0285FF"
                : "#9A999B",
            }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_346_4)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.57 1.6545C12.3972 1.55296 12.2005 1.49941 12 1.49941C11.7996 1.49941 11.6028 1.55296 11.43 1.6545L0.555029 8.0295C0.38577 8.12874 0.245406 8.27051 0.147872 8.44076C0.0503374 8.611 -0.000976562 8.8038 -0.000976562 9C-0.000976562 9.19621 0.0503374 9.389 0.147872 9.55925C0.245406 9.72949 0.38577 9.87127 0.555029 9.9705L11.43 16.3455C11.6028 16.4471 11.7996 16.5006 12 16.5006C12.2005 16.5006 12.3972 16.4471 12.57 16.3455L23.445 9.9705C23.6143 9.87127 23.7547 9.72949 23.8522 9.55925C23.9497 9.389 24.001 9.19621 24.001 9C24.001 8.8038 23.9497 8.611 23.8522 8.44076C23.7547 8.27051 23.6143 8.12874 23.445 8.0295L12.57 1.6545V1.6545ZM12 14.0715L3.34953 9L12 3.93L20.6505 9L12 14.07V14.0715ZM1.69503 14.0295C1.43764 13.8783 1.13073 13.8356 0.841833 13.9107C0.552933 13.9858 0.305702 14.1726 0.154529 14.43C0.00335555 14.6874 -0.0393774 14.9943 0.035731 15.2832C0.110839 15.5721 0.297636 15.8193 0.555029 15.9705L11.43 22.3455C11.6028 22.4471 11.7996 22.5006 12 22.5006C12.2005 22.5006 12.3972 22.4471 12.57 22.3455L23.445 15.9705C23.5725 15.8957 23.6839 15.7964 23.773 15.6785C23.8621 15.5606 23.9271 15.4263 23.9643 15.2832C24.0015 15.1402 24.0102 14.9912 23.9898 14.8448C23.9694 14.6984 23.9204 14.5575 23.8455 14.43C23.7707 14.3026 23.6715 14.1911 23.5535 14.102C23.4356 14.0129 23.3013 13.9479 23.1582 13.9107C23.0152 13.8735 22.8662 13.8649 22.7198 13.8852C22.5734 13.9056 22.4325 13.9547 22.305 14.0295L12 20.0715L1.69503 14.0295Z"
                fill={
                  router.pathname.includes("/app-manager/deployments")
                    ? "#0285FF"
                    : "#9A999B"
                }
              />
            </g>
            <defs>
              <clipPath id="clip0_346_4">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </li>

        <li className="flex-grow"></li>
        <li className="flex justify-center items-center" title="Logout">
          <svg
            onClick={() => {
              localStorage.setItem("token", "");
              disconnectSocket();
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
