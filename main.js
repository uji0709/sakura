import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()

// 霧
const cameraPosZ = 15
scene.fog = new THREE.Fog(0XADDEFF, 5, 30)

// フレームレート
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// 画面サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
}

// カメラ
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  1000
)

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2, window.devicePixelRatio)

// ライト
const light = new THREE.SpotLight(0XC1B6FF, 1000, 500 ,1.0)
light.position.set(0, 10, 0)
scene.add(light)
const lightHelper = new THREE.SpotLightHelper(light)
scene.add(lightHelper)

// オブジェクトグループ
const group = new THREE.Group()
scene.add(group)

// ロゴ3Dモデルの読み込み
const loader = new GLTFLoader() 
const gltf = await loader.loadAsync('/public/eng_lab.glb')
console.log(gltf)
const logo = gltf.scene
// logo.rotation.y = Math.PI * 4 / 3
logo.rotation.z = Math.PI * 2 / 3
logo.rotation.x = Math.PI / 2
logo.scale.set(0.5, 0.5, 0.5)
scene.add(logo)

// const plane = new THREE.PlaneGeometry(5, 1, 10, 10)
// const texloader = new THREE.TextureLoader()
// const texture = texloader.load('/public/lab-logo.png' ); 
// const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide})
// const logo = new THREE.Mesh(plane, material) 
// logo.rotation.y = Math.PI * 4 / 3
// scene.add(logo)

// カメラコントローラー
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = 6.0
controls.enableDamping = true
controls.dampingFactor = 0.01
controls.enablePan = false
controls.enableZoom = false
controls.minPolarAngle = Math.PI / 2
controls.maxPolarAngle = Math.PI / 2

// フレームアニメーション
let frame = 0
const animation = () => {
  stats.begin()
  window.requestAnimationFrame(animation)
  frame = frame <= 350 ? frame + 1 : frame + 1
  controls.update()
  for(let i = 0; i < sakura_num; i++) {
    group.children[i].rotation.y += Math.random() * 0.005
    group.children[i].rotation.x += Math.random() * 0.005
    // group.children[i].position.y = Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4) * 3
    group.children[i].position.y = Math.exp(Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4)) * 2 - 3
    // group.children[i].position.y = 3/2 * Math.cos(Math.exp(Math.sin(frame * Math.PI / 300 - i / sakura_num * Math.PI * 2 + Math.PI * 3 / 4 + 7/2 ))) * 2 - 3
  }
  if(frame < 350) {
    const rotSpeed = -easeOutCirc(frame / 500) * Math.PI * 4
    camera.position.z = Math.cos(rotSpeed) * cameraPosZ
    camera.position.x = Math.sin(rotSpeed) * cameraPosZ
    camera.lookAt(0, 0, 0)
  }
  logo.rotation.z += Math.PI * 2 / 600
  stats.end()
  renderer.render(scene, camera)
}

// 3Dモデルの読み込み
const model = await loader.loadAsync('/public/Strawberry.gltf')
const sakura = model.scene
const sakura_num = 10
for(let i = 0; i < sakura_num + 1; i++) {
  if (i < sakura_num){
    group.add(sakura.clone())
    group.children[i].scale.set(0.3, 0.3, 0.3)
    group.children[i].position.set(
      Math.cos(i / sakura_num * Math.PI * 2) * 5, 
      0,
      Math.sin(i / sakura_num * Math.PI * 2) * 5
    )
    group.children[i].rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
  }else {
    animation()
  }
}

// イージング関数
function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2))
}

// リサイズ
window.addEventListener('resize', function() { 
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setPixelRatio
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
})