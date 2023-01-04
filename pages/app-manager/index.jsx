import BreadCrumb from "../../components/BreadCrumb";

export default function Home() {
  return (
    <div className="p-10 md:ml-20 mb-20 m-0">
      <div className="mb-5">
        <BreadCrumb
          items={[
            {
              label: "Dashboard",
              to: "/app-manager",
            },
          ]}
        />
      </div>
    </div>
  );
}
