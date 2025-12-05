"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Parses an ArrayBuffer containing STL data (binary or ASCII) into a THREE.BufferGeometry
 */
function parseSTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const view = new DataView(arrayBuffer);
  const isASCII = isASCIISTL(arrayBuffer);

  if (isASCII) {
    return parseASCIISTL(arrayBuffer);
  } else {
    return parseBinarySTL(view);
  }
}

/**
 * Checks if the buffer is ASCII STL format
 */
function isASCIISTL(arrayBuffer: ArrayBuffer): boolean {
  const view = new Uint8Array(arrayBuffer);
  const header = new TextDecoder().decode(view.slice(0, 5));
  return header === "solid";
}

/**
 * Parses binary STL format
 */
function parseBinarySTL(view: DataView): THREE.BufferGeometry {
  // Header: 80 bytes (ignored)
  // Num triangles: 4 bytes (uint32)
  const numTriangles = view.getUint32(80, true);

  const vertices: number[] = [];
  const offset = 84;
  const vertexSize = 12; // 4 bytes per float * 3 (x, y, z)
  const normalSize = 12; // We skip this, but it's in the file
  const attributeByteSize = 2; // unused

  for (let i = 0; i < numTriangles; i++) {
    const triangleOffset = offset + i * (normalSize + vertexSize * 3 + attributeByteSize);

    // Skip normal (12 bytes)
    // Read 3 vertices, each with 3 floats (x, y, z)
    for (let j = 0; j < 3; j++) {
      const vertexOffset = triangleOffset + normalSize + j * vertexSize;
      const x = view.getFloat32(vertexOffset, true);
      const y = view.getFloat32(vertexOffset + 4, true);
      const z = view.getFloat32(vertexOffset + 8, true);
      vertices.push(x, y, z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Parses ASCII STL format
 */
function parseASCIISTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const text = new TextDecoder().decode(arrayBuffer);
  const vertices: number[] = [];

  // Match all "vertex x y z" lines
  const vertexPattern = /vertex\s+([+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?)\s+([+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?)\s+([+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?)/g;

  let match;
  while ((match = vertexPattern.exec(text)) !== null) {
    vertices.push(parseFloat(match[1]), parseFloat(match[3]), parseFloat(match[5]));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Computes the bounding box dimensions (in original STL units, assumed to be mm)
 */
function computeDimensions(geometry: THREE.BufferGeometry): {
  width: number;
  height: number;
  depth: number;
} {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  if (!bbox) {
    return { width: 0, height: 0, depth: 0 };
  }

  return {
    width: bbox.max.x - bbox.min.x,
    height: bbox.max.y - bbox.min.y,
    depth: bbox.max.z - bbox.min.z,
  };
}

/**
 * Computes approximate volume of the mesh using signed volume of tetrahedra
 * Returns volume in cubic millimeters
 */
function computeVolume(geometry: THREE.BufferGeometry): number {
  const positionAttribute = geometry.getAttribute("position");
  const positions = positionAttribute.array as Float32Array;

  let volume = 0;

  // Iterate over triangles (each triangle has 3 vertices, 9 floats)
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i];
    const ay = positions[i + 1];
    const az = positions[i + 2];

    const bx = positions[i + 3];
    const by = positions[i + 4];
    const bz = positions[i + 5];

    const cx = positions[i + 6];
    const cy = positions[i + 7];
    const cz = positions[i + 8];

    // Signed volume of tetrahedron formed by origin and triangle (a, b, c)
    // Volume = (a · (b × c)) / 6
    volume += ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx);
  }

  // Return absolute value divided by 6 (tetrahedron formula)
  return Math.abs(volume) / 6;
}

/**
 * Analyzes the mesh to find the largest face (by surface area)
 * and returns the normal vector that best represents it
 */
function findLargestFaceNormal(geometry: THREE.BufferGeometry): THREE.Vector3 {
  const positionAttribute = geometry.getAttribute("position");
  const positions = positionAttribute.array as Float32Array;

  // Store all face normals with their surface areas
  const faces: Array<{ normal: THREE.Vector3; area: number }> = [];

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();

  // Process all triangles
  for (let i = 0; i < positions.length; i += 9) {
    v1.set(positions[i], positions[i + 1], positions[i + 2]);
    v2.set(positions[i + 3], positions[i + 4], positions[i + 5]);
    v3.set(positions[i + 6], positions[i + 7], positions[i + 8]);

    // Compute triangle normal using cross product
    edge1.subVectors(v2, v1);
    edge2.subVectors(v3, v1);
    normal.crossVectors(edge1, edge2);

    // Compute triangle area (half the cross product magnitude)
    const area = normal.length() / 2;

    if (area > 0.001) {
      // Only consider faces with meaningful area
      normal.normalize();
      faces.push({ normal: normal.clone(), area });
    }
  }

  if (faces.length === 0) {
    return new THREE.Vector3(0, 1, 0);
  }

  // Cluster normals that point in similar directions
  const clusters: Array<{ normal: THREE.Vector3; area: number }> = [];
  const angleThreshold = 0.2; // Radians, ~11 degrees

  for (const face of faces) {
    let foundCluster = false;

    // Try to find a similar cluster
    for (const cluster of clusters) {
      const dotProduct = face.normal.dot(cluster.normal);
      // Check if normals point in similar directions
      if (dotProduct > Math.cos(angleThreshold)) {
        // Average the normals and accumulate area
        cluster.normal.add(face.normal.multiplyScalar(face.area / cluster.area)).normalize();
        cluster.area += face.area;
        foundCluster = true;
        break;
      }
    }

    // Create new cluster if no similar one found
    if (!foundCluster) {
      clusters.push({ normal: face.normal.clone(), area: face.area });
    }
  }

  // Find cluster with largest total surface area
  let maxArea = 0;
  let largestNormal = new THREE.Vector3(0, 1, 0);

  for (const cluster of clusters) {
    if (cluster.area > maxArea) {
      maxArea = cluster.area;
      largestNormal = cluster.normal.clone();
    }
  }

  return largestNormal;
}

/**
 * Detects the largest face and orients the model so it stands on that face
 * This analyzes the geometry to find the best orientation for visualization
 */
function detectAndOrientLargestFace(geometry: THREE.BufferGeometry): void {
  // Find the normal vector of the largest face
  const largestFaceNormal = findLargestFaceNormal(geometry);

  // The target is to have the largest face pointing downward (-Y axis)
  const targetDown = new THREE.Vector3(0, -1, 0);

  // Calculate rotation quaternion to align largestFaceNormal with targetDown
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(largestFaceNormal, targetDown);

  // Apply rotation to geometry
  geometry.applyQuaternion(quaternion);
  geometry.computeBoundingBox();
}

/**
 * Normalizes and centers a geometry for better visualization
 * - Orients the model with largest face on the ground
 * - Centers the model at origin
 * - Scales to fit within a reasonable viewport
 */
function normalizeGeometry(geometry: THREE.BufferGeometry): void {
  // First, detect and orient based on largest face
  detectAndOrientLargestFace(geometry);

  geometry.center();

  // Compute bounding box to get dimensions
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  if (!bbox) return;

  // Calculate the maximum dimension
  const sizeX = bbox.max.x - bbox.min.x;
  const sizeY = bbox.max.y - bbox.min.y;
  const sizeZ = bbox.max.z - bbox.min.z;
  const maxSize = Math.max(sizeX, sizeY, sizeZ);

  // Scale to fit within ~50 units (for optimal viewing)
  if (maxSize > 0) {
    const scale = 50 / maxSize;
    geometry.scale(scale, scale, scale);
  }

  // Recenter after scaling
  geometry.center();

  // Update bounding box for accurate dimension calculations
  geometry.computeBoundingBox();
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface StlModel {
  geometry: THREE.BufferGeometry;
  dimensions: { width: number; height: number; depth: number };
  volume: number;
  fileName: string;
  fileSize: number;
}

interface ModelViewerProps {
  model: StlModel | null;
  isLoading: boolean;
}

/**
 * 3D Viewer component using React Three Fiber
 */
function ModelViewer({ model, isLoading }: ModelViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-slate-600">Chargement du modèle...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 2.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
          </svg>
          <p className="text-slate-600">Aucun modèle chargé</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 15]} intensity={0.8} />
      <Grid args={[100, 100]} cellSize={5} cellColor="#e2e8f0" sectionSize={25} sectionColor="#cbd5e1" />

      <mesh geometry={model.geometry} castShadow receiveShadow>
        <meshPhongMaterial color="#3b82f6" shininess={100} />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}

/**
 * File info card
 */
function FileInfoCard({ model }: { model: StlModel | null }) {
  if (!model) return null;

  const volumeMm3 = model.volume;
  const volumeCm3 = volumeMm3 / 1000;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations du modèle</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-600">Fichier</label>
          <p className="text-slate-900 break-all">{model.fileName}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Taille</label>
          <p className="text-slate-900">
            {model.fileSize < 1024 ? `${model.fileSize} B` : `${(model.fileSize / 1024).toFixed(2)} KB`}
          </p>
        </div>

        <hr className="my-3" />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase">Largeur</label>
            <p className="text-sm text-slate-900 font-semibold">{model.dimensions.width.toFixed(2)} mm</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase">Hauteur</label>
            <p className="text-sm text-slate-900 font-semibold">{model.dimensions.height.toFixed(2)} mm</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase">Profondeur</label>
            <p className="text-sm text-slate-900 font-semibold">{model.dimensions.depth.toFixed(2)} mm</p>
          </div>
        </div>

        <hr className="my-3" />

        <div>
          <label className="text-sm font-medium text-slate-600">Volume</label>
          <p className="text-slate-900 font-semibold">{volumeCm3.toFixed(2)} cm³</p>
          <p className="text-xs text-slate-500">({volumeMm3.toFixed(0)} mm³)</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Error message component
 */
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-sm text-red-800">{message}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function StlVisionPage() {
  const [model, setModel] = useState<StlModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setError(null);
      setModel(null);
      return;
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".stl")) {
      setError("Veuillez sélectionner un fichier STL valide.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const geometry = parseSTL(arrayBuffer);

      // Normalize and center the geometry for optimal viewing
      normalizeGeometry(geometry);

      const dimensions = computeDimensions(geometry);
      const volume = computeVolume(geometry);

      setModel({
        geometry,
        dimensions,
        volume,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (err) {
      setError(
        err instanceof Error ? `Erreur lors du chargement : ${err.message}` : "Une erreur est survenue lors du chargement du fichier.",
      );
      setModel(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with back button */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">STL Vision</h1>
            <p className="text-blue-200">Visualisez et analysez vos modèles 3D en STL avec précision.</p>
          </div>
          <Link href="/">
            <button className="group px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 border border-blue-400/30 hover:border-blue-400/60 shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 active:scale-95 cursor-pointer">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour à l'accueil</span>
            </button>
          </Link>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Upload and info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Importer un modèle</h2>

              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Téléchargez un fichier STL (binaire ou ASCII) pour le visualiser en 3D et consulter ses propriétés.
                </p>

                {/* File input */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Charger un fichier STL"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Choisir un fichier
                  </button>
                </div>

                {/* File name display */}
                {model && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-slate-600">Fichier chargé :</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{model.fileName}</p>
                  </div>
                )}

                {/* Instructions */}
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-2">
                  <p className="font-medium text-slate-700">Contrôles de la souris :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Clic gauche + déplacement</strong> : rotation
                    </li>
                    <li>
                      <strong>Molette</strong> : zoom
                    </li>
                    <li>
                      <strong>Clic droit + déplacement</strong> : panoramique
                    </li>
                  </ul>
                </div>

                {/* Error message */}
                {error && <ErrorMessage message={error} />}
              </div>
            </div>

            {/* Model info */}
            <FileInfoCard model={model} />
          </div>

          {/* Right column: 3D Viewer */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200" style={{ height: "500px" }}>
            <ModelViewer model={model} isLoading={isLoading} />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-blue-200 text-sm">
          <p>STL Vision • Défi Nuit de l'Info 2025</p>
        </div>
      </div>
    </main>
  );
}
