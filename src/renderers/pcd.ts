import * as Three from "three"
import { PCDLoader } from "../loaders/pcd.ts"

const WIDTH = 800
const HEIGHT = 600

const camera = new Three.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
const scene = new Three.Scene()
const renderer = new Three.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
camera.position.x = 0.4
camera.position.z = 0
camera.up.set(0, 0, 1)

const renderLoop = () => {
  window.frameCounter++
  renderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
}

const handleLoad = (points: Three.Points) => {
  points.scale.multiplyScalar(0.25)
  points.geometry.center()
  scene.add(points)
  console.log(points)
  renderLoop()
}

export const renderPCD = (data: string | ArrayBuffer) => {
  document.getElementById("view-container")!.innerHTML = ""
  document.getElementById("view-container")!.appendChild(renderer.domElement)
  const loader = new PCDLoader()
  loader.load(data, handleLoad, undefined, (e: unknown) => console.error(e))
}
