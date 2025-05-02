import * as THREE from "three"
import type Experience from "./Experience.ts"
import type Camera from "./Camera.ts"

export default class Renderer {
  experience: Experience
  canvas: HTMLCanvasElement
  sizes: { width: number; height: number; pixelRatio: number }
  scene: THREE.Scene
  camera: Camera
  instance!: THREE.WebGLRenderer

  constructor() {
    this.experience = window.experience // Fixed: Use global instance instead of creating new one
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.setInstance()
  }

  setInstance(): void {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas, // Now correctly typed as HTMLCanvasElement
      antialias: true,
    })

    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setClearColor("#211d20")
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize(): void {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update(): void {
    this.instance.render(this.scene, this.camera.instance)
  }
}
