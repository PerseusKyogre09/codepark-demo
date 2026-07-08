
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { hyperspeedPresets } from '../../constants/hyperspeedPresets';

type HyperspeedProps = {
    effectOptions?: Partial<typeof hyperspeedPresets.one>;
    presetName?: keyof typeof hyperspeedPresets;
};

export default function Hyperspeed({ effectOptions = {}, presetName = 'one' }: HyperspeedProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    // Merge defaults from preset
    const options = { ...hyperspeedPresets[presetName], ...effectOptions };

    useEffect(() => {
        if (!mountRef.current) return;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(options.colors.background);

        // Create distinct aspect ratio for camera
        const container = mountRef.current;
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const camera = new THREE.PerspectiveCamera(options.fov, width / height, 0.1, 1000);
        camera.position.z = 0.1; // Start inside the tunnel
        camera.position.y = options.carFloorSeparation[0];

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // --- Road / Tunnel Geometry ---
        const roadGeometry = new THREE.PlaneGeometry(options.roadWidth, options.length, 60, 200);
        roadGeometry.rotateX(-Math.PI / 2);

        // Shader Uniforms
        const uniforms = {
            uTime: { value: 0 },
            uRoadColor: { value: new THREE.Color(options.colors.roadColor) },
            uIslandColor: { value: new THREE.Color(options.colors.islandColor) },
            uShoulderLines: { value: new THREE.Color(options.colors.shoulderLines) },
            uBrokenLines: { value: new THREE.Color(options.colors.brokenLines) },
            uLanes: { value: options.lanesPerRoad },
            uBrokenLinesLength: { value: options.brokenLinesLengthPercentage },
            uBrokenLinesWidth: { value: options.brokenLinesWidthPercentage },
            uShoulderWidth: { value: options.shoulderLinesWidthPercentage },
            uIslandWidth: { value: options.islandWidth / options.roadWidth },
            uDistortion: { value: 0 },
            uDistortionStrength: { value: 1.0 },
            uSpeed: { value: (options.movingAwaySpeed[0] + options.movingAwaySpeed[1]) / 2 },
        };

        // Determine Distortion Type ID
        let distortionType = 0;
        if (options.distortion === 'turbulentDistortion') distortionType = 1;
        if (options.distortion === 'eturbulentDistortion') distortionType = 1;
        if (options.distortion === 'mountainDistortion') distortionType = 2;
        if (options.distortion === 'xyDistortion') distortionType = 3;
        if (options.distortion === 'deepDistortion') distortionType = 4;
        if (options.distortion === 'longRaceDistortion') distortionType = 5;

        uniforms.uDistortion.value = distortionType;

        // Custom Shader Material for the Road
        const roadMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
        uniform float uTime;
        uniform float uDistortion;
        uniform float uSpeed;
        
        varying vec2 vUv;
        varying vec3 vPos;

        // Psuedo-random 
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        // Noise function for turbulence
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f*f*(3.0-2.0*f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          float distZ = pos.z + uTime * uSpeed; 

          // 1: Turbulent
          if (uDistortion == 1.0) {
             pos.x += sin(pos.z * 0.05 + uTime * 2.0) * 2.0;
             pos.y += cos(pos.z * 0.05 + uTime * 2.0) * 1.0;
          }
          // 2: Mountain
          else if (uDistortion == 2.0) {
             pos.y += noise(vec2(pos.z * 0.05, 0.0)) * 10.0;
          }
          // 3: XY
          else if (uDistortion == 3.0) {
             pos.x += sin(pos.z * 0.1 + uTime) * 5.0;
             pos.y += cos(pos.z * 0.1 + uTime) * 5.0;
          }
           // 4: Deep
          else if (uDistortion == 4.0) {
             pos.y -= pow(abs(pos.z * 0.02), 2.0) * 2.0; 
          }

          vPos = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uRoadColor;
        uniform vec3 uIslandColor;
        uniform vec3 uShoulderLines;
        uniform vec3 uBrokenLines;
        uniform float uLanes;
        uniform float uTime;
        uniform float uSpeed;
        
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
          float x = vUv.x * 2.0 - 1.0;
          float zPos = vUv.y * 400.0 + uTime * (uSpeed * 0.05);

          vec3 color = uRoadColor;

          if (abs(x) < 0.1) {
             color = uIslandColor;
          } else {
             if (mod(abs(x), 0.3) < 0.02 && abs(x) > 0.15) {
                if (sin(zPos * 0.5) > 0.0) {
                    color = uBrokenLines;
                }
             }
          }
          
          float distFade = smoothstep(0.9, 1.0, vUv.y);
          
          gl_FragColor = vec4(color, 1.0 - distFade);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        scene.add(road);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let animationId: number;

        const animate = () => {
            uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // --- Cleanup ---
        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            roadGeometry.dispose();
            roadMaterial.dispose();
            renderer.dispose();
        };
    }, [options]);

    return <div ref={mountRef} className="w-full h-full bg-black" />;
}
