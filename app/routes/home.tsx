import Background from "components/background";
import Loader from "components/loader";
import Pointer from "components/pointer";
import type { Route } from "./+types/home";
import { useEmitter } from "hooks/use-emitter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
    const emitter = useEmitter();
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Background />
      <Pointer />
      <a
        href="/some-link"
        onMouseEnter={() => emitter.emit("pointer:eye:active")}
        onMouseLeave={() => emitter.emit("pointer:eye:inactive")}
        className="block p-4 text-9xl"
      >
        Internal Link
      </a>
      <Loader />
    </div>
  );
}