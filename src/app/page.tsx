"use client";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import Debug from "@react-three/cannon/dist/debug-provider";
import { OrbitControls } from "@react-three/drei";
import {
	BoxBufferGeometryProps,
	BoxGeometryProps,
	Canvas,
	MeshProps,
	MeshStandardMaterialProps,
	SphereBufferGeometryProps,
	SphereGeometryProps,
	useFrame,
	useThree,
} from "@react-three/fiber";
import { useEffect } from "react";
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from "three";
// import Image from "next/image";

export default function Home() {
	return (
		<>
			<Canvas
				style={{ height: "100vh" }}
				camera={{ position: [0, 5, 12], fov: 60 }}
			>
				<Lights />
				{/* <gridHelper /> */}
				<Physics
					gravity={[0, -30, 0]}
					defaultContactMaterial={{ restitution: 1.1 }}
				>
					<Ball />
					<Enemy color={"hotpink"}  />
					<Paddle />
				</Physics>
				<OrbitControls enableRotate={false} />
			</Canvas>
		</>
	);
}

function Ball({
	args = [0.5, 32, 32],
	...props
}: SphereBufferGeometryProps & Omit<MeshProps, "args">) {
	const [ref, api] = useSphere<Mesh>(() => ({ args: [0.5], mass: 1 }));
	const { viewport } = useThree();

	// Physic plane to detect when fall down
	usePlane(() => ({
		position: [0, -viewport.height, 0],
		rotation: [-Math.PI / 2, 0, 0],
		onCollide: () => {
			api.position.set(0, 0, 0);
			api.velocity.set(0, 10, 0);
		},
	}));

	return (
		<mesh ref={ref} {...props}>
			<sphereGeometry args={args} />
			<meshStandardMaterial color="orange" />
		</mesh>
	);
}

function Paddle({
	args = [2, 0.5, 1],
	...props
}: MeshProps & BoxBufferGeometryProps) {
	const [ref, api] = useBox<Mesh>(() => ({ args }));

	useFrame((state) => {
		api.position.set(
			(state.mouse.x * state.viewport.width) / 2.0,
			-state.viewport.height / 3,
			0
		);
		api.rotation.set(0, 0, (state.mouse.x * Math.PI) / 5);
	});
	return (
		<mesh ref={ref} {...props}>
			<boxBufferGeometry args={args} />
			<meshStandardMaterial color="lighblue" />
		</mesh>
	);
}

function Enemy({
	color,
	position,
	...props
}: BoxBufferGeometryProps & Omit<MeshProps, "args">) {
	const [ref, api] = useBox<Mesh>(() => ({ position: [2, 1, 0] }));

	return (
		<mesh ref={ref} {...props} position={[2, 1, 0]}>
			<boxGeometry args={[2, 0.5, 1]} />
			<meshStandardMaterial color={color} />
		</mesh>
	);
}

function Lights() {
	return (
		<>
			<color attach={"background"} args={["black"]} />
			<ambientLight intensity={0.3} />
			<pointLight position={[10, 10, 5]} />
			<pointLight position={[-10, -10, -5]} color={"red"} />
		</>
	);
}
