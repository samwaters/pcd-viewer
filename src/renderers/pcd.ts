import * as Three from "three"
import { Color, Points, Vector3 } from "three"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"
import { AxisChangeEvent, ScaleChangeEvent } from "../events/events.ts"
import { PCDLoader } from "../loaders/pcd.ts"

const WIDTH = 800
const HEIGHT = 600
const FOV = 75

const camera = new Three.PerspectiveCamera(FOV, WIDTH / HEIGHT, 0.1, 1000)
const scene = new Three.Scene()
let points: Points
scene.background = new Color(0x999999)
const renderer = new Three.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
let controls: TrackballControls
const initialScale: Vector3 = new Vector3()
camera.position.z = -0.2

window.addEventListener("AXIS_CHANGE", ((e: CustomEvent<AxisChangeEvent>) => {
  let up: Vector3
  switch (e.detail.newAxis) {
    case "downX":
      up = new Vector3(-1, 0, 0)
      break
    case "upX":
      up = new Vector3(1, 0, 0)
      break
    case "downY":
      up = new Vector3(0, -1, 0)
      break
    case "upY":
      up = new Vector3(0, 1, 0)
      break
    case "downZ":
      up = new Vector3(0, 0, -1)
      break
    case "upZ":
      up = new Vector3(0, 0, 1)
      break
    default:
      up = new Vector3(0, 1, 0)
  }
  camera.up.copy(up)
}) as EventListener)

window.addEventListener("SCALE_CHANGE", ((e: CustomEvent<ScaleChangeEvent>) => {
  const scaleCopy = new Vector3()
  scaleCopy.copy(initialScale)
  points.scale.copy(scaleCopy.multiplyScalar(e.detail.newScale))
}) as EventListener)

const renderLoop = () => {
  window.frameCounter++
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
}

const handleLoad = (p: Points) => {
  points = p
  // Set stuff
  initialScale.copy(points.scale)
  points.scale.multiplyScalar(0.2)
  points.geometry.center()
  scene.add(points)
  camera.up.copy(points.up)
  // Work out where to put the camera
  const center = new Vector3()
  const size = new Vector3()
  points.geometry.boundingBox?.getCenter(center)
  points.geometry.boundingBox?.getSize(size)
  const distance = Math.max(size.x, size.y, size.z)
  const cameraZ = distance / 2 / Math.sin((Math.PI * FOV) / 360)
  const currentLOS = new Vector3().subVectors(controls.target, camera.position)
  const newPos = new Vector3().addVectors(center, currentLOS.setLength(-cameraZ))
  camera.position.copy(newPos)
  camera.lookAt(center)
  controls.target.copy(center)
  controls.update()
  renderLoop()
}

export const renderPCD = (data: string | ArrayBuffer) => {
  document.getElementById("view-container")!.innerHTML = ""
  document.getElementById("view-container")!.appendChild(renderer.domElement)
  // Controls
  controls = new TrackballControls(camera, renderer.domElement)
  controls.rotateSpeed = 2
  controls.zoomSpeed = 0.3
  controls.panSpeed = 0.2
  controls.staticMoving = true
  controls.minDistance = 0.3
  controls.maxDistance = 30
  controls.keys = ["KeyW", "KeyA", "KeyS", "KeyD"]
  const loader = new PCDLoader()
  loader.load(data, handleLoad, undefined, (e: unknown) => console.error(e))
}
