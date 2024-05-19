import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Int32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"
import { AxisChangeEvent, ScaleChangeEvent } from "../events/events.ts"
import { PCDLoader, ParsedPCDData } from "../loaders/pcd.ts"

export class PCDRenderer {
  private static _height = 600
  private static _width = 800
  private static _fov = 75

  private static _camera: PerspectiveCamera
  private static _controls: TrackballControls
  private static _data: ParsedPCDData
  private static _scene: Scene
  private static _initialised = false
  private static _initialScale = new Vector3()
  private static _points: Points
  private static _renderer: WebGLRenderer

  private static _isRendering = false

  private static _axisChange(e: CustomEvent<AxisChangeEvent>) {
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
    PCDRenderer._camera.up.copy(up)
  }

  private static _generatePointCloud() {
    const geometry = new BufferGeometry()
    if (PCDRenderer._data.position.length > 0)
      geometry.setAttribute("position", new Float32BufferAttribute(PCDRenderer._data.position, 3))
    if (PCDRenderer._data.normal.length > 0)
      geometry.setAttribute("normal", new Float32BufferAttribute(PCDRenderer._data.normal, 3))
    if (PCDRenderer._data.color.length > 0)
      geometry.setAttribute("color", new Float32BufferAttribute(PCDRenderer._data.color, 3))
    if (PCDRenderer._data.intensity.length > 0)
      geometry.setAttribute("intensity", new Float32BufferAttribute(PCDRenderer._data.intensity, 1))
    if (PCDRenderer._data.label.length > 0)
      geometry.setAttribute("label", new Int32BufferAttribute(PCDRenderer._data.label, 1))
    geometry.computeBoundingSphere()
    const material = new PointsMaterial({ size: 0.005, color: 0x008000 })
    if (PCDRenderer._data.color.length > 0) {
      material.vertexColors = true
    }
    PCDRenderer._points = new Points(geometry, material)
    PCDRenderer._initialScale.copy(PCDRenderer._points.scale)
    PCDRenderer._points.scale.multiplyScalar(0.2)
    PCDRenderer._points.geometry.center()
    PCDRenderer._scene.add(PCDRenderer._points)
    // Should be able to get the right up axis, this is not always correct though
    PCDRenderer._camera.up.copy(PCDRenderer._points.up)
    // Work out where to put the camera
    const center = new Vector3()
    const size = new Vector3()
    PCDRenderer._points.geometry.boundingBox?.getCenter(center)
    PCDRenderer._points.geometry.boundingBox?.getSize(size)
    const distance = Math.max(size.x, size.y, size.z)
    const cameraZ = distance / 2 / Math.sin((Math.PI * PCDRenderer._fov) / 360)
    const currentLOS = new Vector3().subVectors(PCDRenderer._controls.target, PCDRenderer._camera.position)
    const newPos = new Vector3().addVectors(center, currentLOS.setLength(-cameraZ))
    PCDRenderer._camera.position.copy(newPos)
    PCDRenderer._camera.lookAt(center)
    PCDRenderer._controls.target.copy(center)
    PCDRenderer._controls.update()
  }

  private static _initialise() {
    if (PCDRenderer._initialised) return
    PCDRenderer._camera = new PerspectiveCamera(PCDRenderer._fov, PCDRenderer._width / PCDRenderer._height, 0.1, 1000)
    PCDRenderer._scene = new Scene()
    PCDRenderer._scene.background = new Color(0x999999)
    PCDRenderer._renderer = new WebGLRenderer()
    PCDRenderer._renderer.setSize(PCDRenderer._width, PCDRenderer._height)
    document.getElementById("view-container")!.innerHTML = ""
    document.getElementById("view-container")!.appendChild(PCDRenderer._renderer.domElement)
    PCDRenderer._camera.position.z = -0.2
    PCDRenderer._controls = new TrackballControls(PCDRenderer._camera, PCDRenderer._renderer.domElement)
    PCDRenderer._controls.rotateSpeed = 2
    PCDRenderer._controls.zoomSpeed = 0.3
    PCDRenderer._controls.panSpeed = 0.2
    PCDRenderer._controls.staticMoving = true
    PCDRenderer._controls.minDistance = 0.3
    PCDRenderer._controls.maxDistance = 30
    PCDRenderer._controls.keys = ["KeyW", "KeyA", "KeyS", "KeyD"]
    window.addEventListener("AXIS_CHANGE", PCDRenderer._axisChange as EventListener)
    window.addEventListener("SCALE_CHANGE", PCDRenderer._scaleChange as EventListener)
    PCDRenderer._initialised = true
  }

  private static _renderLoop() {
    if (!PCDRenderer._isRendering) return
    window.frameCounter++
    PCDRenderer._controls.update()
    PCDRenderer._renderer.render(PCDRenderer._scene, PCDRenderer._camera)
    requestAnimationFrame(PCDRenderer._renderLoop)
  }

  private static _scaleChange(e: CustomEvent<ScaleChangeEvent>) {
    const scaleCopy = new Vector3()
    scaleCopy.copy(PCDRenderer._initialScale)
    PCDRenderer._points.scale.copy(scaleCopy.multiplyScalar(e.detail.newScale))
  }

  private static _renderPCD(data: ParsedPCDData | undefined) {
    if (!data) throw new Error("Invalid data")
    PCDRenderer._initialise()
    PCDRenderer._data = data
    PCDRenderer._scene.clear()
    // TODO - decide whether to render as Points or Cubes
    PCDRenderer._generatePointCloud()
    PCDRenderer.start()
  }

  public static loadPCD(data: string | ArrayBuffer) {
    const loader = new PCDLoader()
    loader.load(data, PCDRenderer._renderPCD, undefined, (e: unknown) => console.error(e))
  }

  public static start() {
    if (PCDRenderer._isRendering) return
    PCDRenderer._isRendering = true
    PCDRenderer._renderLoop()
  }

  public static stop() {
    PCDRenderer._isRendering = false
  }
}
