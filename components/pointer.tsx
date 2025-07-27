import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGsap } from "hooks/use-gsap";
import { useEmitter } from "hooks/use-emitter";
import { useReducedMotion } from "hooks/use-reduced-motion";

import EyeIcon from "../assets/img/eye.svg";
import LinkIcon from "../assets/img/link.svg";
import TextIcon from "../assets/img/text.svg";

const pointerModifiersWhitelist = ["eye", "link", "text"] as const;

type PointerModifier = (typeof pointerModifiersWhitelist)[number];

const SVGComponents = {
  eye: EyeIcon,
  link: LinkIcon,
  text: TextIcon,
} as const;

function Pointer() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const [pointerState, setPointerState] = useState<PointerModifier | "">("");
  const [firstMove, setFirstMove] = useState(false);
  const { gsap } = useGsap();
  const emitter = useEmitter();
  const prefersReducedMotion = useReducedMotion();

  const minifiedScale = 0.175;

  useEffect(() => {
    if (!pointerRef.current || !gsap) return;

    // Initial setup
    gsap.set(pointerRef.current, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      autoAlpha: 0,
      scale: minifiedScale,
    });

    const isTouch = 'ontouchstart' in document.documentElement;
    if (isTouch || prefersReducedMotion) return;

    // Quick animation functions
    const toPointerX = gsap.quickTo(pointerRef.current, 'x', {
      ease: 'expo.out',
      duration: 0.5,
    });
    const toPointerY = gsap.quickTo(pointerRef.current, 'y', {
      ease: 'expo.out',
      duration: 0.5,
    });

    const pointerScaleTl = gsap.to(pointerRef.current, {
      scale: '-=0.15',
      ease: 'back.out',
      duration: 0.25,
      paused: true,
    });

    // Event handlers
    const handlePointerMove = ({ clientX, clientY }: PointerEvent) => {
      if (!firstMove) {
        gsap.to(pointerRef.current, { autoAlpha: 1, clearProps: 'opacity' });
        setFirstMove(true);
      }
      toPointerX(clientX);
      toPointerY(clientY);
    };

    const handlePointerDown = () => {
      if (pointerState !== '') pointerScaleTl.play();
    };

    const handlePointerUp = () => {
      if (pointerState !== '') pointerScaleTl.reverse();
    };

    // Add event listeners
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gsap, pointerState, prefersReducedMotion, firstMove]);

  // Handle pointer state changes
  useEffect(() => {
    if (!pointerRef.current || !gsap) return;

    const pointerTl = gsap.timeline({
      defaults: { ease: 'back.out', duration: 0.3 },
      paused: true,
    });

    if (pointerState) {
      pointerTl.to(pointerRef.current, { scale: 1 });
    } else {
      pointerTl.to(pointerRef.current, { scale: minifiedScale });
    }

    pointerTl.play();
  }, [pointerState, gsap]);

  // Emitter event listeners
  useEffect(() => {
    const handleActive = (modifier: PointerModifier) => () => {
      setPointerState(modifier);
    };

    const handleInactive = () => {
      setPointerState("");
    };

    // Set up listeners for each modifier
    pointerModifiersWhitelist.forEach(modifier => {
      emitter.on(`pointer:${modifier}:active`, handleActive(modifier));
      emitter.on(`pointer:${modifier}:inactive`, handleInactive);
    });

    emitter.on('pointer:inactive', handleInactive);

    // Cleanup
    return () => {
      pointerModifiersWhitelist.forEach(modifier => {
        emitter.off(`pointer:${modifier}:active`, handleActive(modifier));
        emitter.off(`pointer:${modifier}:inactive`, handleInactive);
      });
      emitter.off('pointer:inactive', handleInactive);
    };
  }, [emitter]);

  const CurrentSVG = pointerState ? SVGComponents[pointerState] : null;

  return (
    <div 
      ref={pointerRef} 
      className="pointer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9,
        width: 'min(calc(5rem + 1vw), 6rem)',
        height: 'min(calc(5rem + 1vw), 6rem)',
        opacity: 0,
        borderRadius: '50%',
        backgroundColor: '#ffe6ed',
        mixBlendMode: 'exclusion',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.2s ease',
      }}
    >
      {CurrentSVG && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '30%',
            height: '30%',
            color: '#030303',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CurrentSVG />
        </div>
      )}
    </div>
  );
}

export default Pointer;
