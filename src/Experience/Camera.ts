import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import type Experience from "./Experience.ts" // Changed to type import and added .js extension

export default class Camera {
  experience: Experience
  canvas: HTMLCanvasElement
  sizes: { width: number; height: number; pixelRatio: number }
  scene: THREE.Scene
  instance!: THREE.PerspectiveCamera // Added missing property declaration
  controls!: OrbitControls // Added missing property declaration

  constructor() {
    this.experience = window.experience // Use global instance instead of creating new one
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}
