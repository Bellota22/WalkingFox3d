import Resources from '../Utils/Resources.ts'
import Experience from '../Experience.ts'
import * as THREE from 'three'

// Interfaz para las texturas
interface FloorTextures {
  color: THREE.Texture;
  normal: THREE.Texture;
}

// Interfaz para los recursos
interface ResourcesWithItems extends Resources {
  items: {
    grassColorTexture: THREE.Texture;
    grassNormalTexture: THREE.Texture;
  }
}

export default class Floor {
  experience: Experience;
  scene: THREE.Scene;
  resources: ResourcesWithItems;
  textures!: FloorTextures;
  geometry!: THREE.CircleGeometry;
  material!: THREE.MeshStandardMaterial;
  mesh!: THREE.Mesh;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources as ResourcesWithItems;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry(): void {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures(): void {
    this.textures = {} as FloorTextures;

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial(): void {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal
    });
  }

  setMesh(): void {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}