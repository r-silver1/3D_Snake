import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-canvas-comp',
  templateUrl: './canvas-comp.component.html',
  styles: [
  ]
})
export class CanvasCompComponent implements OnInit {
  constructor() { }

  scene = new THREE.Scene()
  geometry = new THREE.BoxGeometry(1, 1, 1)
  mesh = new THREE.Mesh(this.geometry)

  camera = new THREE.PerspectiveCamera(60, 800 / 600)


  renderer: any;

  window_size(): void {
    // @ts-ignore
    const HEIGHT = document.getElementById('mainCanvas').clientHeight;
    // @ts-ignore
    const WIDTH = document.getElementById('mainCanvas').clientWidth;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  ngOnInit(): void {
    this.scene.add(this.mesh)
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.draw') as HTMLCanvasElement
      // canvas: <HTMLCanvasElement> document.querySelector('canvas.draw') (bad form)
    })
    this.camera.position.z = 3
    this.camera.position.x = .5
    this.camera.position.y = 1
    this.scene.add(this.camera)
    // this.renderer.setSize(800, 600)
    this.window_size();
    this.renderer.render(this.scene, this.camera);
  }

}
