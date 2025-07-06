import React, { useRef, useEffect, useCallback, use } from "react";

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

import { useGsap } from "hooks/use-gsap";
import { useEmitter } from "hooks/use-emitter";
import { useReducedMotion } from "hooks/use-reduced-motion";

import fragmentShader from "../assets/fragment.glsl";
import vertexShader from "../assets/vertex.glsl";
import { WhiteBrownOrange as pallet } from "../assets/color";

function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gsap } = useGsap();
  const emitter = useEmitter();
  const prefersReducedMotion = useReducedMotion();

  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const glRef = useRef<OGLRenderingContext | null>(null);
  const objectRef = useRef<Mesh | null>(null);
  const isShaderRunningRef = useRef<boolean>(false);
  const aspectRef = useRef<number>(16 / 9);

  const MAX_DPR = 1.5;

  const resize = useCallback(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const gl = glRef.current;
    const object = objectRef.current;

    if (!renderer || !camera || !gl || !object) return;

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });

    object.program.uniforms.resolution.value.set(
      window.innerWidth,
      window.innerHeight
    );

    object.updateMatrix();
    camera.updateMatrix();
  }, []);

  const render = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const object = objectRef.current;

    if (!renderer || !scene || !camera || !object) return;
    if (!isShaderRunningRef.current) return;

    const nextTime = prefersReducedMotion ? 0 : 0.0085;
    object.program.uniforms.time.value += nextTime;

    renderer.render({ scene, camera });
  }, [prefersReducedMotion]);

  const createBackground = useCallback(() => {
    if (!canvasRef.current) return;

    aspectRef.current = window.innerWidth / window.innerHeight;

    const backgroundColor = pallet.color1.dark;
    const clearColor = backgroundColor.map((number) => number / 255);

    const renderer = new Renderer({
      canvas: canvasRef.current,
      dpr: Math.min(window.devicePixelRatio, MAX_DPR),
      alpha: false,
      depth: false,
      width: window.innerWidth,
      height: window.innerHeight,
      powerPreference: "high-performance",
    });

    const gl = renderer.gl;
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1);

    const camera = new Camera(gl, {
      fov: 70,
      aspect: aspectRef.current,
      near: 0.5,
      far: 1.5,
    });
    camera.position.set(0, 0, 1);

    const scene = new Transform();

    const objectSize = 2;
    const objectGeometry = new Plane(gl, {
      width: objectSize * aspectRef.current,
      height: objectSize,
    });

    const objectMaterial = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        time: { value: 0.0 },
        randomSeed: { value: Math.random() },
        objectOpacity: { value: 0.0 },
        noisePower: { value: 1.0 },
        pixelRatio: { value: window.devicePixelRatio },
        resolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
        color1: {
          value: new Color(
            pallet.color1.dark[0] / 255,
            pallet.color1.dark[1] / 255,
            pallet.color1.dark[2] / 255
          ),
        },
        color2: {
          value: new Color(
            pallet.color2.dark[0] / 255,
            pallet.color2.dark[1] / 255,
            pallet.color2.dark[2] / 255
          ),
        },
        color3: {
          value: new Color(
            pallet.color3.dark[0] / 255,
            pallet.color3.dark[1] / 255,
            pallet.color3.dark[2] / 255
          ),
        },
      },
    });

    const object = new Mesh(gl, {
      geometry: objectGeometry,
      program: objectMaterial,
    });
    object.setParent(scene);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;
    glRef.current = gl;
    objectRef.current = object;
    isShaderRunningRef.current = true;

    object.matrixAutoUpdate = false;
    camera.matrixAutoUpdate = false;

    const observer = new ResizeObserver(resize);
    observer.observe(canvasRef.current.parentElement!);

    const callbackTicker = gsap.ticker.add(render);

    gsap.to(object.program.uniforms.objectOpacity, {
      value: 1,
      duration: 1,
      delay: 0.4,
      onComplete: () => emitter.emit("shader:running"),
    });

    return () => {
      gsap.ticker.remove(callbackTicker);
      observer.disconnect();
      isShaderRunningRef.current = false;
    };
  }, [gsap, emitter, resize, render]);

  useEffect(() => {
    const cleanup = createBackground();
    return cleanup;
  }, [createBackground]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default Background;
