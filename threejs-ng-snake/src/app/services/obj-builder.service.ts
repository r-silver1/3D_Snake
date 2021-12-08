import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ObjBuilderService {

  constructor() { }

  public initBoxes(shapesArray: any, scene:THREE.Scene): void {
      const min_diam = .025
      const max_diam = .6
      const min_val = 0;
      const max_val = 99;
      // todo add some color variation
//         let material = new THREE.MeshPhongMaterial({
//                         color: new THREE.Color('rgb(159,226,221)')
//                     })
      for(let i = min_val; i<max_val+1; i++){
          const blueCol = Math.floor(this.norm_range(120, 255, min_val, max_val, i));
          const greenCol = Math.floor(this.norm_range(0, 255, min_val, max_val, i));
          let material = new THREE.MeshPhongMaterial({
//                                     color: new THREE.Color('rgb(159,226,'+Math.floor(this.norm_range(120, 255, min_val, max_val, i))+')')
                                     color: new THREE.Color('rgb(159,'+greenCol+','+blueCol+')')
                              })
          let box_rad = this.norm_range(min_diam, max_diam, min_val, max_val, i)
          let newGeo = new THREE.BoxGeometry(box_rad, box_rad, box_rad)
          let min_bound = max_diam*4
          let horzAngle = Math.random()*360.0
          let vertAngle = Math.random()*360.0
          let ranVec = new THREE.Vector3(min_bound*Math.cos(horzAngle), min_bound*Math.sin(vertAngle), min_bound*Math.sin(horzAngle))
          let pos = [ranVec.x, ranVec.y, ranVec.z]
          let box_temp = this.makeInstance(newGeo, material, pos, scene)
//           this.shapesArray.push(box_temp)
          shapesArray.push(box_temp)
      }
  }

  public makeInstance(geometry: any, material: any, vertices: any[], scene: THREE.Scene): THREE.Mesh{
      const shape = new THREE.Mesh(geometry, material);
      shape.castShadow = true;
      shape.receiveShadow = true;
      //add to g_scene to be rendered
//       this.scene.add(shape);
      scene.add(shape);
      //set position of shape
      shape.position.x = vertices[0];
      shape.position.y = vertices[1];
      shape.position.z = vertices[2];
      return shape;
  }

  norm_range(a:number, b:number, min:number, max:number, x:number): number {
          return a + ((x-min)/(max-min))*(b-a)
      }

}
