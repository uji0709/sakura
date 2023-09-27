import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()

const sizes = {
  width: innerWidth,
  height: innerHeight,
}

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const light = new THREE.PointLight( 0xffffff, 20, 50 ,1.0)
light.position.set(2, 5, 3)
scene.add(light)

const lightHelper = new THREE.PointLightHelper(light)
scene.add(lightHelper)

const group = new THREE.Group()
scene.add(group)

for(let i = 0; i < 5; i++) {
  const radian = i / 5 * Math.PI * 2
  const loader = new GLTFLoader()
  const sakura = await loader.loadAsync('/public/rock/rock_04_4k.gltf')
  const model = sakura.scene;
  model.scale.set(1.5, 1.5, 1.5)
  model.position.set(
    Math.cos(radian) * 5,
    0,
    Math.sin(radian) * 5
    )
  group.add(model);
}

group.rotation.x = Math.PI / 10

camera.position.set(3, 0, 10)
camera.lookAt(0, 0, 0)

function rotate() {
  if(group){
    group.rotation.y += 0.002
  }
}

function boxrotate() {
  if(group){
    for(let i = 0; i < 5; i++) {
      group.children[i].rotation.z += 0.003
      group.children[i].rotation.x += 0.002
    }
  }
}

const tick = () => {
  window.requestAnimationFrame(tick)
  rotate()
  boxrotate()
  renderer.render(scene, camera)
}
tick()

window.addEventListener('resize', function() { 
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setPixelRatio
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
})
