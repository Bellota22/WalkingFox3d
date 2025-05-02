import * as THREE from "three"
import Sizes from "./Utils/Sizes.ts"
import Time from "./Utils/Time.ts"
import Camera from "./Camera.ts"
import Renderer from "./Renderer.ts"
import World from './World/World.ts'
import Resources from './Utils/Resources.ts'
import sources from './sources.ts'
import Debug from './Utils/Debug.ts'

let instance: Experience | null = null

declare global {
  interface Window {
    experience: Experience
  }
}

export default class Experience {
  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  time!: Time;
  scene!: THREE.Scene;
  resources!: Resources
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  debug!: Debug

  constructor(canvas?: HTMLCanvasElement) {
    if (instance){
      return instance 
    }

    instance = this
    // global access
    window.experience = this

    //Options
    this.canvas = canvas || document.createElement("canvas") // Provide default to avoid undefined

    //Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    // this.environment = new Environment()
    this.world = new World()

    

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize()
    })

    //Time tick event
    this.time.on("tick", () => {
      this.update()
    })
  }

  resize(){
    this.camera.resize()
    this.renderer.resize()
  }

  update(){
    this.camera.update()
    this.world.update()
    this.renderer.update()

  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for ( const key in child.material){
          const value = child.material[key]
          if (value && typeof value.dispose === 'function'){
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if(this.debug.active) {
      this.debug.ui?.destroy()
    }

  }

}
