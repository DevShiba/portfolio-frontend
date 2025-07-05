import {
  Renderer,
  Transform,
  Camera,
  Plane,
  Program,
  Vec2,
  Color,
  Mesh,
  type OGLRenderingContext,
} from "ogl";

import fragmentShader from "../assets/fragment.glsl";
import vertexShader from "../assets/vertex.glsl";

import { WhitePinkGreen as pallet } from "../assets/color";
import { useGsap } from "hooks/use-gsap";
import { useRef } from "react";

function Background() {

  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const glRef = useRef<OGLRenderingContext | null>(null);
  const objectRef = useRef<Transform | null>(null);
  const isShaderRunningRef = useRef<boolean>(false);
  const aspectRef = useRef<number>(16 / 9);

  return (
    <div>Background</div>
  )
}

export default Background