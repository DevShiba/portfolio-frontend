import Background from "components/background";
import Loader from "components/loader";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Background />
      <Loader />
    </div>
  );
}