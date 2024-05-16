import * as Three from "three"
import { Mesh } from "three"

const WIDTH = 800
const HEIGHT = 600

const camera = new Three.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
const scene = new Three.Scene()
const renderer = new Three.WebGLRenderer()
let cube: Mesh
renderer.setSize(WIDTH, HEIGHT)

const renderLoop = () => {
  window.frameCounter++
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
}

export const renderCube = () => {
  document.getElementById("view-container")!.innerHTML = ""
  document.getElementById("view-container")!.appendChild(renderer.domElement)
  const geometry = new Three.BoxGeometry(1, 1, 1)
  const material = new Three.MeshBasicMaterial({ color: 0x008000 })
  cube = new Three.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5
  renderLoop()
}
