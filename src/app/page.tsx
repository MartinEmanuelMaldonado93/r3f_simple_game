"use client";
import {
	Physics,
	Triplet,
	useBox,
	usePlane,
	useSphere,
} from "@react-three/cannon";
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
				<Physics
					gravity={[0, -30, 0]}
					defaultContactMaterial={{ restitution: 1.1 }}
				>
					<Ball />
					<Enemy color={"hotpink"} />
					<Enemy color={"yellow"} position={[-2, 2, 0]} />
					<Enemy color={"green"} position={[1, 5, 0]} />
					<Enemy color={"red"} position={[-6, 2.5, 0]} />
					<Paddle />
				</Physics>
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
	position = [2, 1, 0],
	...props
}: BoxBufferGeometryProps & Omit<MeshProps, "args">) {
	const [ref, api] = useBox<Mesh>(() => ({ position: position as Triplet }));
	
	return (
		<mesh ref={ref} {...props} position={position}>
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
