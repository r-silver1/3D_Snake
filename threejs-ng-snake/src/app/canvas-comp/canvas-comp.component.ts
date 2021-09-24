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
  geometry = new THREE.BoxGeometry(1,1,1)
  mesh = new THREE.Mesh(this.geometry)

  camera = new THREE.PerspectiveCamera(60, 800/600)


  renderer: any;

  ngOnInit(): void {
    this.scene.add(this.mesh)
    this.renderer = new THREE.WebGLRenderer({
      canvas: <HTMLCanvasElement>document.querySelector('canvas.draw')
    })
    this.camera.position.z = 3
    this.camera.position.x = .5
    this.camera.position.y = 1
    this.scene.add(this.camera)
    this.renderer.setSize(800, 600)
    this.renderer.render(this.scene, this.camera)
  }

}
