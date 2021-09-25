import { Circle } from "better-react-spinkit";

function loading() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="grid place-items-center">
        <img
          src="/images/logo.png"
          alt="logo"
          style={{ marginBottom: 10 }}
          height={200}
          width={200}
          className="object-contain"
        />
        <div className="mt-4">
          <Circle color="#4c68d7" size={60} />
        </div>
      </div>
    </div>
  );
}

export default loading;
