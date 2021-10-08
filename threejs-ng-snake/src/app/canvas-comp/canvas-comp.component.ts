import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-canvas-comp',
  templateUrl: './canvas-comp.component.html',
  styles: [
  ]
})


export class CanvasCompComponent implements OnInit {

  public scene: THREE.Scene;
  public geometry: THREE.BoxGeometry;
  public mesh: THREE.Mesh;
  public material: THREE.MeshPhongMaterial;
  public camera: THREE.PerspectiveCamera;
  public renderer: any;
  public start: any;
  public controls: any;

  constructor() {
    this.scene = new THREE.Scene();
    // light
    {
      const colorAmb = 0xFFFFFF;
      const intensity = .6;
      const ambLight = new THREE.AmbientLight(colorAmb, intensity);
      this.scene.add(ambLight);
    }

    // light 2
    {
      const colorDir = new THREE.Color('rgba(0, 0, 100)');
      const intensityDir = 1;
      const lightDir = new THREE.DirectionalLight(colorDir, intensityDir);
      lightDir.position.set(0, 1, -1);
      this.scene.add(lightDir);
    }


    // fog
    {
      const color = new THREE.Color('rgba(200, 200, 200)')
      const near = 1;
      const far = 4;
      this.scene.fog = new THREE.Fog(color, near, far);
      this.scene.background = new THREE.Color('rgb(1,59,58)');
    }
    // geometry
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshPhongMaterial({color: new THREE.Color('rgb(205,164,226)')})
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 1
    this.mesh.name = 'test_box';
    this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
    this.start = -1;
    // necessary to enable "this" keyword to work correctly inside animate
    this.animate = this.animate.bind(this);
  }



  init_cameras(): void {
    this.camera.position.z = 3;
    this.camera.position.x = .5;
    this.camera.position.y = 1;
    const domElement = document.querySelector('canvas.draw') as HTMLCanvasElement
    this.controls = new OrbitControls(this.camera, domElement)
    this.scene.add(this.camera);
  }

  window_set_size(): void {
    // @ts-ignore
    const HEIGHT = document.getElementById('mainCanvas').clientHeight;
    // @ts-ignore
    const WIDTH = document.getElementById('mainCanvas').clientWidth;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  window_size_listener(): void {
    window.addEventListener('resize', () => {
      this.window_set_size();
    });
  }

  render_all(): void {
    this.renderer.render(this.scene, this.camera);
  }

  // @ts-ignore
  animate(timestamp): FrameRequestCallback {
    if (this.start === -1){
      this.start = timestamp;
    }
    const elapsed = timestamp - this.start;
    // console.log('elapsed:' + elapsed);
    const testCube = this.scene.getObjectByName('test_box');
    let signFlip: any;
    if (elapsed % 5000 > 2500){
      signFlip = 1;
    }else{
      signFlip = -1;
    }
    // @ts-ignore
    testCube.position.x += signFlip * .01;
    // @ts-ignore
    testCube.position.y += signFlip * .01;
    // @ts-ignore
    testCube.rotation.y += .01;
    this.render_all()
    requestAnimationFrame(this.animate);
  }

  ngOnInit(): void {
    this.scene.add(this.mesh);
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.draw') as HTMLCanvasElement
      // canvas: <HTMLCanvasElement> document.querySelector('canvas.draw') (bad form)
    });
    // @ts-ignore
    this.renderer.setClearColor(this.scene.fog.color)
    this.init_cameras();
    this.window_set_size();
    this.window_size_listener();
    requestAnimationFrame(this.animate);
    // this.renderer.render(this.scene, this.camera);
  }

}
