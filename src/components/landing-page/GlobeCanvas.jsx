import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
//Custom utils
import CanvasLoader from "./Loader";

const Globe = () => {
  const globe = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={globe.scene} scale={3} position-y={0} rotation-y={0} />
  );
};

const GlobeCanvas = () => {
  return (
    <Canvas
      shadows
      frameLoop="demand"
      gl={{ preserveDrawingBuffer: true }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Globe />
      </Suspense>
    </Canvas>
  );
};

export default GlobeCanvas;
