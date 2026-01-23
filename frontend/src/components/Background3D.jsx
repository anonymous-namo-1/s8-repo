import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

let Canvas, useFrame, useThree, Float, MeshTransmissionMaterial;
let THREE;

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

function CSSFallbackBackground({ tier }) {
  const isFull = tier === 'full';
  const isReduced = tier === 'reduced';

  const shapes = useMemo(() => {
    const fullShapes = [
      { type: 'cube', size: 80, x: '75%', y: '15%', duration: 20, delay: 0, rotateAxis: 'xyz' },
      { type: 'pyramid', size: 60, x: '85%', y: '40%', duration: 25, delay: 2, rotateAxis: 'y' },
      { type: 'octahedron', size: 70, x: '70%', y: '60%', duration: 22, delay: 1, rotateAxis: 'xz' },
      { type: 'torus', size: 90, x: '60%', y: '25%', duration: 30, delay: 3, rotateAxis: 'xyz' },
      { type: 'cube', size: 50, x: '90%', y: '70%', duration: 18, delay: 0.5, rotateAxis: 'y' },
      { type: 'icosahedron', size: 55, x: '80%', y: '85%', duration: 24, delay: 1.5, rotateAxis: 'xz' },
      { type: 'dodecahedron', size: 65, x: '65%', y: '80%', duration: 28, delay: 2.5, rotateAxis: 'xyz' },
      { type: 'pyramid', size: 45, x: '55%', y: '10%', duration: 21, delay: 4, rotateAxis: 'y' },
    ];
    
    if (isFull) return fullShapes;
    if (isReduced) return fullShapes.slice(0, 5);
    return fullShapes.slice(0, 3);
  }, [isFull, isReduced]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, perspective: '1000px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-secondary/10" />
      
      {shapes.map((shape, index) => (
        <div
          key={index}
          className="absolute transform-gpu"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            transformStyle: 'preserve-3d',
            animation: `float3d-${shape.rotateAxis} ${shape.duration}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`,
          }}
        >
          <Shape3D type={shape.type} size={shape.size} />
        </div>
      ))}
      
      <ParticlesCSSFallback count={isFull ? 50 : isReduced ? 30 : 15} />
      
      <style>{`
        @keyframes float3d-xyz {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: translateY(-20px) rotateX(90deg) rotateY(45deg) rotateZ(22deg); }
          50% { transform: translateY(-10px) rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
          75% { transform: translateY(-25px) rotateX(270deg) rotateY(135deg) rotateZ(67deg); }
        }
        @keyframes float3d-y {
          0%, 100% { transform: translateY(0) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(180deg); }
        }
        @keyframes float3d-xz {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateZ(0deg); }
          25% { transform: translateY(-15px) rotateX(45deg) rotateZ(22deg); }
          50% { transform: translateY(-25px) rotateX(90deg) rotateZ(45deg); }
          75% { transform: translateY(-10px) rotateX(135deg) rotateZ(67deg); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateZ(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateZ(20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function Shape3D({ type, size }) {
  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    backfaceVisibility: 'visible',
  };

  if (type === 'cube') {
    const halfSize = size / 2;
    return (
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div style={{ ...faceStyle, transform: `translateZ(${halfSize}px)` }} />
        <div style={{ ...faceStyle, transform: `translateZ(-${halfSize}px) rotateY(180deg)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfSize}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfSize}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfSize}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfSize}px)` }} />
      </div>
    );
  }

  if (type === 'pyramid') {
    return (
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div style={{
          ...faceStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: `rotateX(30deg) translateZ(${size / 3}px)`,
        }} />
        <div style={{
          ...faceStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: `rotateY(90deg) rotateX(30deg) translateZ(${size / 3}px)`,
        }} />
        <div style={{
          ...faceStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: `rotateY(180deg) rotateX(30deg) translateZ(${size / 3}px)`,
        }} />
        <div style={{
          ...faceStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: `rotateY(270deg) rotateX(30deg) translateZ(${size / 3}px)`,
        }} />
      </div>
    );
  }

  if (type === 'octahedron') {
    return (
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {[0, 90, 180, 270].map((angle, i) => (
          <React.Fragment key={i}>
            <div style={{
              ...faceStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: `rotateY(${angle}deg) rotateX(35deg) translateZ(${size / 3}px)`,
            }} />
            <div style={{
              ...faceStyle,
              clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
              transform: `rotateY(${angle}deg) rotateX(-35deg) translateZ(${size / 3}px)`,
            }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (type === 'torus') {
    const segments = 12;
    return (
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size * 0.3,
              height: size * 0.3,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              transform: `
                translate(-50%, -50%)
                rotateY(${(360 / segments) * i}deg)
                translateX(${size * 0.35}px)
              `,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'icosahedron' || type === 'dodecahedron') {
    return (
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <React.Fragment key={i}>
            <div style={{
              ...faceStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: `rotateY(${angle}deg) rotateX(${20 + i * 5}deg) translateZ(${size / 2.5}px)`,
            }} />
            <div style={{
              ...faceStyle,
              clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
              transform: `rotateY(${angle + 36}deg) rotateX(${-20 - i * 5}deg) translateZ(${size / 2.5}px)`,
            }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div style={{ ...faceStyle, borderRadius: '50%' }} />
  );
}

function ParticlesCSSFallback({ count }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-foreground/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `particle-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function WebGLBackground({ tier }) {
  const canvasRef = useRef(null);
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
      ref={canvasRef}
    >
      <WebGLCanvas tier={tier} />
    </div>
  );
}

function WebGLCanvas({ tier }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const componentsRef = useRef({});

  useEffect(() => {
    async function loadThree() {
      try {
        const threeModule = await import('three');
        const fiberModule = await import('@react-three/fiber');
        const dreiModule = await import('@react-three/drei');
        
        THREE = threeModule;
        Canvas = fiberModule.Canvas;
        useFrame = fiberModule.useFrame;
        useThree = fiberModule.useThree;
        Float = dreiModule.Float;
        MeshTransmissionMaterial = dreiModule.MeshTransmissionMaterial;
        
        componentsRef.current = { THREE, Canvas, useFrame, useThree, Float, MeshTransmissionMaterial };
        setLoaded(true);
      } catch (e) {
        console.warn('WebGL libraries failed to load:', e);
        setError(true);
      }
    }
    loadThree();
  }, []);

  if (error) {
    return <CSSFallbackBackground tier={tier} />;
  }

  if (!loaded) {
    return <CSSFallbackBackground tier={tier} />;
  }

  return <ThreeScene tier={tier} components={componentsRef.current} />;
}

function ThreeScene({ tier, components }) {
  const { THREE: ThreeLib, Canvas: ThreeCanvas, useFrame: useFrameHook, useThree: useThreeHook, Float: FloatComponent } = components;
  
  const isFull = tier === 'full';
  const isReduced = tier === 'reduced';
  
  const dpr = useMemo(() => {
    if (tier === 'full') return [1, 2];
    if (tier === 'reduced') return [1, 1.5];
    return [0.5, 1];
  }, [tier]);

  function FloatingGeometry({ position, geometry, scale, speed, rotationSpeed, color, delay }) {
    const meshRef = useRef();
    const initialY = position[1];
    
    useFrameHook((state) => {
      if (meshRef.current) {
        const time = state.clock.elapsedTime + delay;
        meshRef.current.position.y = initialY + Math.sin(time * speed) * 0.5;
        meshRef.current.rotation.x += rotationSpeed * 0.003;
        meshRef.current.rotation.y += rotationSpeed * 0.002;
        meshRef.current.rotation.z += rotationSpeed * 0.001;
      }
    });

    const Geometry = useMemo(() => {
      switch (geometry) {
        case 'torus':
          return <torusGeometry args={[1, 0.4, 16, 32]} />;
        case 'torusKnot':
          return <torusKnotGeometry args={[0.8, 0.25, 64, 8]} />;
        case 'octahedron':
          return <octahedronGeometry args={[1, 0]} />;
        case 'icosahedron':
          return <icosahedronGeometry args={[1, 0]} />;
        case 'dodecahedron':
          return <dodecahedronGeometry args={[1, 0]} />;
        case 'tetrahedron':
          return <tetrahedronGeometry args={[1, 0]} />;
        case 'cone':
          return <coneGeometry args={[0.8, 1.5, 6]} />;
        case 'cylinder':
          return <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />;
        default:
          return <boxGeometry args={[1, 1, 1]} />;
      }
    }, [geometry]);

    return (
      <FloatComponent
        speed={speed * 0.5}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        floatingRange={[-0.2, 0.2]}
      >
        <mesh ref={meshRef} position={position} scale={scale}>
          {Geometry}
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.15}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>
      </FloatComponent>
    );
  }

  function ParticleField({ count, spread }) {
    const particlesRef = useRef();
    
    const positions = useMemo(() => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
      }
      return pos;
    }, [count, spread]);

    useFrameHook((state) => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      }
    });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#888888"
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    );
  }

  function GridPlane() {
    const gridRef = useRef();

    useFrameHook((state) => {
      if (gridRef.current) {
        gridRef.current.position.z = -5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      }
    });

    return (
      <group ref={gridRef} position={[0, -3, -5]} rotation={[-Math.PI / 4, 0, 0]}>
        <gridHelper args={[40, 40, '#333333', '#222222']} />
      </group>
    );
  }

  function MouseFollower() {
    const { viewport } = useThreeHook();
    const lightRef = useRef();
    const targetPos = useRef({ x: 0, y: 0 });

    useFrameHook((state) => {
      if (lightRef.current) {
        targetPos.current.x = ThreeLib.MathUtils.lerp(
          targetPos.current.x,
          (state.pointer.x * viewport.width) / 2,
          0.05
        );
        targetPos.current.y = ThreeLib.MathUtils.lerp(
          targetPos.current.y,
          (state.pointer.y * viewport.height) / 2,
          0.05
        );
        lightRef.current.position.x = targetPos.current.x;
        lightRef.current.position.y = targetPos.current.y;
      }
    });

    return (
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        intensity={0.3}
        color="#ffffff"
        distance={15}
      />
    );
  }

  const geometries = useMemo(() => {
    const fullGeometries = [
      { geometry: 'torusKnot', position: [4, 2, -2], scale: 0.6, speed: 0.8, rotationSpeed: 1, color: '#1a1a1a', delay: 0 },
      { geometry: 'octahedron', position: [-4, 1, -3], scale: 0.8, speed: 1, rotationSpeed: 0.8, color: '#2a2a2a', delay: 1 },
      { geometry: 'icosahedron', position: [3, -2, -4], scale: 0.7, speed: 0.9, rotationSpeed: 1.2, color: '#333333', delay: 2 },
      { geometry: 'torus', position: [-3, -1, -2], scale: 0.5, speed: 1.1, rotationSpeed: 0.9, color: '#222222', delay: 0.5 },
      { geometry: 'dodecahedron', position: [5, 0, -5], scale: 0.9, speed: 0.7, rotationSpeed: 0.7, color: '#1f1f1f', delay: 1.5 },
      { geometry: 'tetrahedron', position: [-5, 2, -4], scale: 0.6, speed: 1.2, rotationSpeed: 1.1, color: '#2f2f2f', delay: 2.5 },
      { geometry: 'cone', position: [2, 3, -3], scale: 0.5, speed: 0.85, rotationSpeed: 0.95, color: '#252525', delay: 0.8 },
      { geometry: 'cylinder', position: [-2, -3, -3], scale: 0.55, speed: 0.95, rotationSpeed: 0.85, color: '#2d2d2d', delay: 1.8 },
    ];

    return isFull ? fullGeometries : fullGeometries.slice(0, 4);
  }, [isFull]);

  const particleCount = isFull ? 200 : isReduced ? 100 : 50;

  return (
    <ThreeCanvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={dpr}
      gl={{
        antialias: tier === 'full',
        alpha: true,
        powerPreference: tier === 'full' ? 'high-performance' : 'low-power',
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: true,
      }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#aaaaaa" />
        
        {isFull && <MouseFollower />}
        
        <ParticleField count={particleCount} spread={20} />
        
        {isFull && <GridPlane />}
        
        {geometries.map((geo, index) => (
          <FloatingGeometry key={index} {...geo} />
        ))}
        
        <fog attach="fog" args={['#fafafa', 5, 25]} />
      </Suspense>
    </ThreeCanvas>
  );
}

export function Background3D() {
  const { tier, isMinimal } = useDeviceCapabilities();
  const [supportsWebGL, setSupportsWebGL] = useState(null);

  useEffect(() => {
    setSupportsWebGL(checkWebGLSupport());
  }, []);

  if (supportsWebGL === null) {
    return <CSSFallbackBackground tier={tier} />;
  }

  if (!supportsWebGL || isMinimal) {
    return <CSSFallbackBackground tier={tier} />;
  }

  return <WebGLBackground tier={tier} />;
}
