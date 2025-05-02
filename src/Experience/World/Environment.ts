import * as THREE from 'three'
import Experience from '../Experience.ts'
import Resources from '../Utils/Resources.ts'
import Debug from '../Utils/Debug.ts'

// Interfaz para los recursos con items
interface ResourcesWithItems extends Resources {
  items: {
    environmentMapTexture: THREE.Texture;
  }
}

// Interfaz para el environmentMap
interface EnvironmentMap {
  intensity: number;
  texture: THREE.Texture;
  updateMaterials: () => void;
}

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  resources: ResourcesWithItems;
  sunLight!: THREE.DirectionalLight;
  environmentMap!: EnvironmentMap;
  debug: Debug;
  debugFolder: any;
  
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources as ResourcesWithItems;
    this.debug = this.experience.debug;

    if(this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight(): void {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    if(this.debug.active) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvironmentMap(): void {
    this.environmentMap = {} as EnvironmentMap;
    this.environmentMap.intensity = 0.2;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    
    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    
    this.environmentMap.updateMaterials();

    // Debug helper (opcional)
    const helper = new THREE.DirectionalLightHelper(this.sunLight, 1);
    this.scene.add(helper);

    if(this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}