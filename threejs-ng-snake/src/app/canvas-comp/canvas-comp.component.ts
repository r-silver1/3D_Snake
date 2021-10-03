import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

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
  public camera: THREE.PerspectiveCamera;
  public renderer: any;
  public start: any;

  constructor() {

    this.scene = new THREE.Scene();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry);
    this.camera = new THREE.PerspectiveCamera(60, 800 / 600);
    this.start = -1;
    this.animate = this.animate.bind(this);
  }



  init_cameras(): void {
    this.camera.position.z = 3;
    this.camera.position.x = .5;
    this.camera.position.y = 1;
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
    this.render_all()
    requestAnimationFrame(this.animate);
  }

  ngOnInit(): void {
    this.scene.add(this.mesh);
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.draw') as HTMLCanvasElement
      // canvas: <HTMLCanvasElement> document.querySelector('canvas.draw') (bad form)
    });
    this.init_cameras();
    this.window_set_size();
    this.window_size_listener();
    requestAnimationFrame(this.animate);
    // this.renderer.render(this.scene, this.camera);
  }

}
