(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Scott\Documents\personal_coding\3D_snake\threejs-ng-snake\src\main.ts */"zUnb");


/***/ }),

/***/ "9PKO":
/*!**************************************!*\
  !*** ./src/app/classes/laser-ray.ts ***!
  \**************************************/
/*! exports provided: LaserRay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaserRay", function() { return LaserRay; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");

// import BufferGeometryUtils from '../js/BufferGeometryUtils'
// import * as BFUTILS from '../js/BufferGeometryUtils'
class LaserRay {
    constructor(camera, targetAxes) {
        //     private texture_uri: any = ".\\assets\\crazier_greens.png"
        this.texture_uri = ".\\assets\\crazier_greens_2.png";
        const topRadius = .004;
        const bottomRadius = .0005;
        const height = .2;
        const segments = 20;
        this.texture = new three__WEBPACK_IMPORTED_MODULE_0__["TextureLoader"]().load(this.texture_uri);
        //         this.laserMat = new THREE.SpriteMaterial({
        this.laserMat = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({
            map: this.texture,
            //             blending: THREE.AdditiveBlending,
            side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"],
            transparent: true,
            opacity: .75
        });
        this.laserGeo = new three__WEBPACK_IMPORTED_MODULE_0__["CylinderGeometry"](topRadius, bottomRadius, height, segments);
        // move center down?
        this.laserGeo.applyMatrix4(new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().makeTranslation(0, -height / 2, 0));
        // rotate 90deg x axis
        this.laserGeo.applyMatrix4(new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().makeRotationX(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(90)));
        this.laserSprite = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](this.laserGeo, this.laserMat);
        this.laserGeo.dispose();
        this.laserMat.dispose();
        //         this.laserSprite.position.set(0, 1.2, 7.5)
        this.laserSprite.position.copy(camera.position);
        // this should move out of camera view?
        this.laserSprite.z -= 1;
        // todo new logic user data target axes
        this.laserSprite.userData.targetAxes = targetAxes;
        // todo : new logic use arrow function versus static function
        this.laserSprite.userData.updateLaserPosition = () => {
            this.laserSprite.position.add(this.laserSprite.userData.targetAxes.setLength(.08));
        };
        this.laserSprite.userData.getLaserTravelDistance = (camera) => {
            return this.laserSprite.position.distanceTo(camera.position);
        };
        this.laserSprite.userData.deleteLaser = () => {
            // @ts-ignore
            this.laserSprite.geometry.dispose();
            // @ts-ignore
            this.laserSprite.material.dispose();
            this.laserSprite.removeFromParent();
        };
        // todo must uncomment for helpers
        //         this.upHelper = new THREE.ArrowHelper(this.laserSprite.up, new THREE.Vector3(0,0,0), 1, new THREE.Color('rgb(0, 200, 200)'))
        //         this.upHelper.name = "laserUpHelper"
        //         let temp_vec = new THREE.Vector3().copy(this.laserSprite.position)
        //         temp_vec.sub(camera.position)
        //         this.laserSprite.rotateX(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
        //         console.log(temp_vec.angleTo(new THREE.Vector3(1,0,0)))
        //         this.laserSprite.rotateX(3)
        //         this.laserSprite.rotateX(5)
    }
    static checkIfCharged() {
        //         console.log(this.rechargeTime)
        //         console.log(typeof new Date().valueOf())
        if (this.charged == true) {
            return true;
        }
        else if ((new Date().valueOf() - this.lastShot) >= this.rechargeTime) {
            this.charged = true;
        }
        return this.charged;
    }
    static setDepleted() {
        this.charged = false;
        this.lastShot = new Date().valueOf();
    }
}
// todo new logic: recharge time milliseconds
LaserRay.rechargeTime = 300;
LaserRay.charged = true;
LaserRay.lastShot = -1;


/***/ }),

/***/ "9ecQ":
/*!**************************************************!*\
  !*** ./src/app/services/font-builder.service.ts ***!
  \**************************************************/
/*! exports provided: FontBuilderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontBuilderService", function() { return FontBuilderService; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var three_src_loaders_FontLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/src/loaders/FontLoader */ "EpSA");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");




class FontBuilderService {
    constructor() {
        this.loader = new three_src_loaders_FontLoader__WEBPACK_IMPORTED_MODULE_1__["FontLoader"]();
    }
    addFont(msg, scene, sceneGroupName, positionScale, size) {
        this.loader.load(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].fontUri, font => {
            const fontColor = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(0, 200, 200)');
            const matLite = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({
                color: fontColor,
                transparent: true,
                opacity: .5,
                side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"],
                wireframe: true
            });
            const message = msg;
            const shape = font.generateShapes(message, size);
            const textGeo = new three__WEBPACK_IMPORTED_MODULE_0__["ShapeGeometry"](shape);
            const text = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](textGeo, matLite);
            text.position.set(positionScale.x, positionScale.y, positionScale.z);
            text.userData.fontColor = fontColor;
            let matBox = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]().copy(matLite);
            let boxHelper = new three__WEBPACK_IMPORTED_MODULE_0__["Box3"]().setFromObject(text);
            text.userData.boxHelper = boxHelper;
            let boxWidth = (boxHelper.max.x - boxHelper.min.x);
            // todo new logic avoid overly small sizes like with letter I
            if (boxWidth < size / 3) {
                boxWidth += size / 2;
            }
            const boxHeight = boxHelper.max.y - boxHelper.min.y;
            const boxDepth = boxHelper.max.z - boxHelper.min.z;
            let boxGeo = new three__WEBPACK_IMPORTED_MODULE_0__["BoxGeometry"](boxWidth, boxHeight, boxDepth);
            matBox.color.b += .5;
            matBox.color.g -= .5;
            matBox.transparent = true;
            matBox.opacity = .3;
            let boxMesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](boxGeo, matBox);
            boxGeo.scale(1.5, 1.4, 1);
            // todo slight tweaks to line up better
            boxMesh.position.x = (positionScale.x + boxWidth / 2);
            boxMesh.position.y = (positionScale.y + boxHeight / 2);
            boxMesh.position.z = (positionScale.z + boxDepth / 2);
            let tempVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
            boxHelper.getCenter(tempVec);
            boxMesh.translateOnAxis(tempVec.add(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].cameraPos.multiplyScalar(-1)).normalize(), -size / 2);
            // todo new logic move this into userdata
            text.userData.boxMesh = boxMesh;
            matBox.dispose();
            boxGeo.dispose();
            // todo new logic dispose like with laser ray
            textGeo.dispose();
            matLite.dispose();
            // new logic store msg in userdata
            text.userData.message = message;
            let boxHelperMesh = new three__WEBPACK_IMPORTED_MODULE_0__["Box3"]().setFromObject(boxMesh);
            // todo new logic userdata set boxhelper from mesh not text
            text.userData.boxHelper = boxHelperMesh;
            // todo new logic set z plane from boxhelper set from text not mesh
            text.userData.textZPlane = text.userData.boxHelper.min.z;
            // new logic - userdata function
            text.userData.deleteText = () => {
                text.userData.boxHelper = null;
                // delete box
                text.userData.boxMesh.geometry.dispose();
                text.userData.boxMesh.material.dispose();
                text.userData.boxMesh.removeFromParent();
                text.geometry.dispose();
                text.material.dispose();
                text.removeFromParent();
            };
            // new logic - laser collision
            text.userData.checkPointConflict = (point) => {
                if ((point.z <= text.userData.textZPlane && point.z >= text.userData.textZPlane * .99) &&
                    (text.userData.boxHelper.min.x <= point.x && text.userData.boxHelper.max.x >= point.x) &&
                    (text.userData.boxHelper.min.y <= point.y && text.userData.boxHelper.max.y >= point.y)) {
                    text.material.wireframe = false;
                    text.userData.boxMesh.material.wireframe = false;
                    return true;
                }
                return false;
            };
            // todo new logic refresh wireFrame
            text.userData.refreshTextWireframe = () => {
                text.material.wireframe = true;
                text.userData.boxMesh.material.wireframe = true;
            };
            let wordGroup = scene.getObjectByName(sceneGroupName);
            if (wordGroup != undefined) {
                wordGroup.add(text);
                wordGroup.add(boxMesh);
            }
        });
    }
}
FontBuilderService.ɵfac = function FontBuilderService_Factory(t) { return new (t || FontBuilderService)(); };
FontBuilderService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: FontBuilderService, factory: FontBuilderService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Le96":
/*!*****************************************************!*\
  !*** ./src/app/classes/random-shape-class.model.ts ***!
  \*****************************************************/
/*! exports provided: RandomShapeClass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomShapeClass", function() { return RandomShapeClass; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ "wY2j");


// https://www.typescriptlang.org/docs/handbook/interfaces.html
// https://www.cloudhadoop.com/angular-model-class-interface/
class RandomShapeClass {
    // todo here take box colors bool as param
    constructor(material, radius, position, maxPoints, boxHelpersBool) {
        // todo : pushDir, potential to add to userData
        this.pushDir = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 0);
        // todo : material passed into constructor; ideal?
        this.material = material;
        // todo : material and radius : two fields to add userdata
        this.radius = radius;
        this.position = position;
        this.maxPoints = maxPoints;
        this.geometry = this.makeRandomGeometry(maxPoints, radius);
        // todo necessary for vertices const here? also could have helper
        // to translate given simple pos input
        let posVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.position[0], this.position[1], this.position[2]);
        let posLength = posVec.length();
        // todo shapeObj : where to add userdata
        this.shapeObj = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](this.geometry, this.material);
        //todo new logic dispose of this
        this.geometry.dispose();
        this.material.dispose();
        // todo new logic score
        //             this.shapeObj.userData.points = RandomShapeClass.maxScore - THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore)
        // todo new logic use base score + inverse sqrt function
        this.shapeObj.userData.points = RandomShapeClass.baseScore + 2 * (Math.sqrt(RandomShapeClass.maxScore) + -(Math.sqrt(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(this.radius, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].min_asteroid_radius, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore) + 1)));
        // todo new logic asteroid spin
        this.shapeObj.userData.spin = (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].max_asteroid_spin * 1.1) - three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(this.radius, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].min_asteroid_radius, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].max_asteroid_radius, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].min_asteroid_spin, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].max_asteroid_spin);
        //             this.shapeObj.userData.points = THREE.MathUtils.mapLinear(this.radius, environment.min_asteroid_radius, environment.max_asteroid_radius, RandomShapeClass.minScore, RandomShapeClass.maxScore)
        //             this.geometry.translate(vertices[0], vertices[1], vertices[2])
        // todo should be no reason translate in constructor
        this.shapeObj.translateOnAxis(posVec.normalize(), posLength);
        this.shapeObj.castShadow = true;
        this.shapeObj.receiveShadow = true;
        this.worldRadius = 0;
        this.direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        this.thetaNow = 0;
        this.thetaDif = 0;
        this.initDirectionTheta();
        // boolean flag display direction helper or no ( DEPRECATED )
        this.directionBool = false;
        // conflictHit: used to determine box color, red or green
        this.conflictHit = false;
        // make a box helper, passing in false boolean because no initial conflict
        this.shapeObj.userData.boxHelpers = boxHelpersBool;
        if (boxHelpersBool) {
            this.boxHelper = this.makeBoxHelper(false);
        }
        else {
            this.boxHelper = undefined;
        }
        // also make box geometry used for conflict checking
        this.boxGeo = this.makeBoxGeo();
    }
    initDirectionTheta() {
        let shapeObjXZ = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]().copy(this.shapeObj.position);
        // project vector shape position on plane; used to find rotation angle around y axis
        shapeObjXZ.projectOnPlane(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0));
        // worldRadius : length of vector projected
        // todo worldRadius : potential userdata field
        this.worldRadius = shapeObjXZ.length();
        this.direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        // theta now : angle from projected position vector to x axis
        // todo theta now : potential add to userdata
        this.thetaNow = shapeObjXZ.angleTo(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](1, 0, 0));
        // angle To: finds shortest
        if (shapeObjXZ.z < 0) {
            this.thetaNow *= -1;
        }
        // theta dif:
        this.thetaDif = -.0001 / this.radius + -.001;
    }
    getDirection() {
        return this.direction;
    }
    //     updateDirectionTheta(){
    //         let shapeObjXZ = new THREE.Vector3().copy(this.shapeObj.position)
    //         shapeObjXZ.projectOnPlane(new THREE.Vector3(0, 1, 0))
    //         this.worldRadius = shapeObjXZ.length()
    //         this.thetaNow = shapeObjXZ.angleTo(new THREE.Vector3(1, 0, 0));
    //         // angle To: finds shortest
    //         if(shapeObjXZ.z < 0 ){
    //             this.thetaNow *= -1;
    //         }
    //     }
    // https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/coord.html
    makeCircle(index, maxPoints, radius, yIndex) {
        // 0 <= index < maxPoints - 1
        const pointsNum = maxPoints - index;
        // coneMultiplier:set to 1 and sphereMultiplier to 0 for cone
        const coneMultiplier = .5;
        // coneRadius: equation to trace out edges cone
        const coneRadius = radius * (pointsNum / maxPoints);
        // sphereMultiplier:set to 1 and coneMultiplier to 0 for orb
        const sphereMultiplier = 1.0 - coneMultiplier;
        const sphereRadius = Math.sqrt(Math.pow(radius, 2) - Math.pow(yIndex, 2));
        let circleRadius = ((coneRadius * coneMultiplier) + (sphereRadius * sphereMultiplier));
        //uncomment for hourglass
        //         const circleRadius: number = radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(yIndex, 2))
        let circlePointsMat = [];
        let last = 0.0;
        let thetaDiff = 360.0 / pointsNum;
        for (let i = 0; i < pointsNum; i++) {
            // random value between last generated angle and theta increment
            let theta = last + (Math.random() * (thetaDiff));
            if (i == 0) {
                theta = 0;
            }
            else if (i == pointsNum - 1) {
                theta = 360;
            }
            last += thetaDiff;
            //             let iX:number = Math.cos(this.thetaToRad(theta)) * circleRadius;
            let iX = Math.cos(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(theta)) * circleRadius;
            //             let iZ:number = Math.sin(this.thetaToRad(theta)) * circleRadius;
            let iZ = Math.sin(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(theta)) * circleRadius;
            circlePointsMat.push([iX, yIndex, iZ]);
        }
        return circlePointsMat;
    }
    makeCirclesArrays(maxPoints, radius, bottomFlag) {
        let numCircles = maxPoints - 1;
        // smaller number, taller asteroid, vice versa
        //         let heightSquisher : number = 1
        //         let yStep = radius / (heightSquisher*numCircles);
        let yStep = radius / numCircles;
        let yIndex = 0;
        if (bottomFlag == true) {
            yStep *= -1;
        }
        let circles = new Array(numCircles);
        for (let i = 0; i < numCircles; i++) {
            let currCircle = this.makeCircle(i, maxPoints, radius, yIndex);
            circles[i] = currCircle;
            yIndex += yStep;
        }
        return circles;
    }
    pushTwoCircles(circleOne, circleTwo, bufferArr) {
        let indxOne = 0;
        let indxTwo = 0;
        let indxBool = true;
        const numPoints = circleOne.length;
        while (indxOne < numPoints - 1) {
            if (indxBool) {
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                indxOne++;
                bufferArr = bufferArr.concat(circleOne[indxOne]);
            }
            else {
                indxTwo++;
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo - 1]);
            }
            indxBool = !indxBool;
        }
        bufferArr.concat(circleTwo[circleTwo.length - 1]);
        bufferArr.concat(circleOne[circleOne.length - 1]);
        bufferArr.concat(circleTwo[0]);
        bufferArr.concat(circleOne[circleOne.length - 1]);
        bufferArr.concat(circleTwo[0]);
        bufferArr.concat(circleOne[0]);
        return bufferArr;
    }
    pushBottomCircles(circleOne, circleTwo, bufferArr) {
        let indxOne = 0;
        let indxTwo = 0;
        let indxBool = true;
        const numPoints = circleOne.length;
        // could shorten logic by breaking this part into separate function for both and merging
        while (indxOne < numPoints - 1) {
            if (indxBool) {
                indxOne++;
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne - 1]);
            }
            else {
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
                bufferArr = bufferArr.concat(circleOne[indxOne]);
                indxTwo++;
                bufferArr = bufferArr.concat(circleTwo[indxTwo]);
            }
            indxBool = !indxBool;
        }
        bufferArr.concat(circleTwo[circleTwo.length - 1]);
        bufferArr.concat(circleOne[circleOne.length - 1]);
        bufferArr.concat(circleTwo[0]);
        bufferArr.concat(circleOne[circleOne.length - 1]);
        bufferArr.concat(circleTwo[0]);
        bufferArr.concat(circleOne[0]);
        return bufferArr;
    }
    makeRandomGeometry(maxPoints, radius) {
        radius /= 1.2;
        let circlesPointsArr = this.makeCirclesArrays(maxPoints, radius, false);
        let currObjArr = [];
        for (let i = 0; i < circlesPointsArr.length - 2; i++) {
            currObjArr = this.pushTwoCircles(circlesPointsArr[i], circlesPointsArr[i + 1], currObjArr);
        }
        let bottomPointsArr = this.makeCirclesArrays(maxPoints, radius, true);
        bottomPointsArr[0] = circlesPointsArr[0];
        for (let i = 0; i < bottomPointsArr.length - 2; i++) {
            currObjArr = this.pushBottomCircles(bottomPointsArr[i], bottomPointsArr[i + 1], currObjArr);
        }
        let geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
        geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_0__["BufferAttribute"](new Float32Array(currObjArr), 3));
        geometry.computeVertexNormals();
        return geometry;
    }
    // https://threejs.org/docs/index.html#api/en/core/BufferGeometry.groups
    // https://dustinpfister.github.io/2021/04/22/threejs-buffer-geometry/
    makeInstance(scene) {
        const shape = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](this.geometry, this.material);
        return this.shapeObj;
    }
    updateBoxHelper() {
        if (this.shapeObj.userData.boxHelpers == true) {
            this.boxHelper.update();
        }
        this.boxGeo.setFromObject(this.shapeObj, true);
    }
    makeBoxGeo() {
        let tempBox = new three__WEBPACK_IMPORTED_MODULE_0__["Box3"]();
        tempBox.setFromObject(this.shapeObj);
        return tempBox;
    }
    // todo here reference bool box helper to make or not
    changeBoxHelperCol(checkBool) {
        if (this.shapeObj.userData.boxHelpers == true) {
            this.boxHelper.material.dispose();
            this.boxHelper.geometry.dispose();
            this.boxHelper = this.makeBoxHelper(checkBool);
        }
        this.boxGeo = this.makeBoxGeo();
    }
    deleteAsteroid() {
        if (this.shapeObj.userData.boxHelpers == true) {
            this.boxHelper.material.dispose();
            this.boxHelper.geometry.dispose();
            this.boxHelper.removeFromParent();
        }
        this.shapeObj.geometry.dispose();
        this.shapeObj.removeFromParent();
    }
    makeBoxHelper(checkBool) {
        let colChoice = RandomShapeClass.blueColor;
        if (checkBool == true) {
            colChoice = RandomShapeClass.redColor;
        }
        return new three__WEBPACK_IMPORTED_MODULE_0__["BoxHelper"](this.shapeObj, colChoice);
    }
    updatePushOnBump(other) {
        let otherTemp = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.shapeObj.position.x - other.shapeObj.position.x, this.shapeObj.position.y - other.shapeObj.position.y, this.shapeObj.position.z - other.shapeObj.position.z);
        this.pushDir.add(otherTemp.multiplyScalar(1));
        otherTemp.multiplyScalar(-1);
        other.pushDir.add(otherTemp);
    }
    checkOtherConflict(other) {
        let boxCheck = this.boxGeo.intersectsBox(other.boxGeo);
        // todo movement push: make other function not called here?
        if (boxCheck == true) {
            this.updatePushOnBump(other);
        }
        return boxCheck;
    }
    checkPointConflict(point) {
        return this.boxGeo.containsPoint(point);
    }
    setAsteroidDirection() {
        // vector position one theta increment up
        this.thetaNow += this.thetaDif;
        // direction: vector one thetadif rotation more around y axis; next position asteroid should be
        this.direction.set(this.worldRadius * Math.cos(this.thetaNow), this.shapeObj.position.y, (this.worldRadius * .9) * Math.sin(this.thetaNow));
        //         // find difference between new position and current position; direction vector
        this.direction.add(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]().copy(this.shapeObj.position).multiplyScalar(-1));
        // pushdir: the "bounce" between asteroids; only present if bounce happens
        if (this.pushDir.length() > .01) {
            let newPushVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]().copy(this.pushDir).multiplyScalar(.01);
            this.direction.add(newPushVec);
            this.pushDir.add(newPushVec.multiplyScalar(-1));
        }
        // direction: at this point, literally the vector with direction and magnitude equal to what should be pushed
        this.shapeObj.position.add(this.direction);
        if (this.directionBool == true) {
            this.updateRotationHelper(this.direction);
            this.updateDirectionHelper(this.direction);
        }
    }
    initRotationHelper() {
        this.directionBool = true;
        this.position = [this.shapeObj.position.x, this.shapeObj.position.y, this.shapeObj.position.z];
        //         const arrowLen = .5;
        const arrowLen = this.radius * 2;
        const arrowCol = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(200, 0, 40)');
        const arrowPos = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.position[0], this.position[1], this.position[2]);
        this.rotationHelper = new three__WEBPACK_IMPORTED_MODULE_0__["ArrowHelper"](this.shapeObj.up, arrowPos, arrowLen, arrowCol);
        return this.rotationHelper;
    }
    //https://threejs.org/docs/#api/en/core/BufferGeometry
    //https://threejs.org/docs/#api/en/core/Object3D
    //https://computergraphics.stackexchange.com/questions/10362/threejs-updating-an-objects-matrix-doesnt-change-its-position-and-rotation-pa
    updateRotationHelper(transVec) {
        this.rotationHelper.setRotationFromEuler(this.shapeObj.rotation);
        this.rotationHelper.position.add(transVec);
        this.rotationHelper.position.setComponent(1, this.shapeObj.position.y);
    }
    initDirectionHelper() {
        this.directionBool = true;
        this.position = [this.shapeObj.position.x, this.shapeObj.position.y, this.shapeObj.position.z];
        //         const arrowLen = .5;
        const arrowLen = this.radius * 2;
        const arrowCol = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(0, 200, 40)');
        const arrowPos = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](this.position[0], this.position[1], this.position[2]);
        this.directionHelper = new three__WEBPACK_IMPORTED_MODULE_0__["ArrowHelper"](this.direction, arrowPos, arrowLen, arrowCol);
        return this.directionHelper;
    }
    updateDirectionHelper(transVec) {
        const dirCopy = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        dirCopy.copy(this.direction).normalize();
        this.directionHelper.setDirection(dirCopy);
        this.directionHelper.position.add(transVec);
    }
    setWorldRadius(newRad) {
        this.worldRadius = newRad;
    }
    getWorldRadius() {
        return this.worldRadius;
    }
    setPushDir(numList) {
        this.pushDir.x = numList[0];
        this.pushDir.y = numList[1];
        this.pushDir.z = numList[2];
    }
    getPushDir() {
        return this.pushDir;
    }
}
// static members
RandomShapeClass.blueColor = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(0,120,255)');
RandomShapeClass.redColor = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(255,120,0)');
RandomShapeClass.minScore = 1;
RandomShapeClass.maxScore = 20000;
// todo new logic base score to have as minimum
RandomShapeClass.baseScore = Math.sqrt(RandomShapeClass.maxScore) / 2;


/***/ }),

/***/ "LlEI":
/*!******************************************************!*\
  !*** ./src/app/services/post-game-helper.service.ts ***!
  \******************************************************/
/*! exports provided: PostGameHelperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostGameHelperService", function() { return PostGameHelperService; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



class PostGameHelperService {
    constructor() { }
    postGameRouter(scene, timestamp, builderService, scoreboardService, fontService) {
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].gameStopTime == 0) {
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].gameStopTime = timestamp;
        }
        // timesUp mode
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode == _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName1) {
            this.timesUpLogic(scene, fontService);
        }
        if (timestamp - _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].gameStopTime > 2000) {
            if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode == _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName2) {
                this.displayKeyboardLogic(scene, fontService);
            }
            if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode == _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName3) {
                this.nameInputLogic(scene, fontService, builderService);
            }
            if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode == _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName4) {
                this.postScoreLogic(scene, builderService, fontService, scoreboardService, timestamp);
            }
        }
    }
    timesUpLogic(scene, fontService) {
        let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
        if (timerGroupObj != undefined) {
            fontService.addFont("Time's up!!", scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].largeFontSize);
        }
        // Entry mode
        _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName2;
    }
    displayKeyboardLogic(scene, fontService) {
        let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
        if (timerGroupObj != undefined) {
            timerGroupObj.children.forEach((child, i) => {
                child.userData.deleteText();
                _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].gameStopTime = -1;
            });
            // todo logic add enter name group
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].nameEntryString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].largeFontSize);
            // create keyboard
            let maxChars = Math.floor(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].keysAlphabet.length / 4);
            let curX = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x + (maxChars * .25 * _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x);
            let curY = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.y;
            // todo new logic add play again button
            // todo new logic using env var not "PLAY AGAIN" hardcode
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].playAgainString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.x - _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize * 7, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.y + _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize * 2, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.z * .85), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize * .80);
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].keysAlphabet.forEach((characterVal, index) => {
                if (index > 0 && index % maxChars == 0) {
                    curX = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x + (maxChars * .25 * _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x);
                    curY -= _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize * 2.5;
                }
                fontService.addFont(characterVal, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x + curX, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.y + curY, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.z), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize);
                curX += _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize * 2.5;
            });
            // todo new enter button logic
            curY -= _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize * 2.5;
            curX /= 2;
            // todo new logic user env var not "ENTER" hardcode
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].enterString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x + curX, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.y + curY, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.z), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize);
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].deleteString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.x - curX, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.y + curY, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.z), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize);
            // mode 3 scoreboard
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].postGameMode = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].modeName3;
        }
    }
    nameInputLogic(scene, fontService, builderService) {
        // todo new logic check keyboard collide
        builderService.checkLaserKeyboardCollisions(scene);
        //
        let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
        if (timerGroupObj != undefined) {
            // todo logic only refresh these if necessary
            timerGroupObj.children.forEach((child, i) => {
                // todo new logic check if message beginning == NAME:
                if (child.userData.message != undefined && child.userData.message.substr(0, 5) == _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].nameEntryString.substr(0, 5) && child.userData.message.slice(6, child.userData.message.length) != _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].currWordEntry) {
                    if (child.userData.deleteText != undefined) {
                        child.userData.deleteText();
                    }
                    // @ts-ignore
                    //                                 timerGroupObj.children.splice(i, 1)
                    fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].nameEntryString + _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].currWordEntry, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].largeFontSize);
                    return;
                }
            });
        }
        //
    }
    postScoreLogic(scene, builderService, fontService, scoreboardService, timestamp) {
        let buttonGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName);
        if (buttonGroup != undefined && buttonGroup.children.length != 0 && _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] != 2) {
            buttonGroup.children.forEach((child, i) => {
                if (child.userData.deleteText != undefined) {
                    child.userData.deleteText();
                }
            });
            // todo make new function for get scoreboard api
        }
        // todo here temporary logic might not want to use this method of first element scoreboard
        // todo also added logic make sure button group cleared before switching, weird bug with empty name enter causing O and N keys to remain
        //@ts-ignore
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] == -1 && buttonGroup.children.length == 0) {
            // post score and set scoreboard object [0] -2
            this.scoreBoardPostLogic(scoreboardService);
        }
        else if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] == -2) {
            // get scoreboard, which sets scoreboard object [0] 1
            this.getScoreBoardLogic(scene, scoreboardService);
        }
        else if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] == 1) {
            // ensure that all old text is deleted prepare for showing high scores, then set scoreboard object [0] 2
            this.deleteOldTextLogic(scene);
            // todo new logic
            // block after here: scoreboard object 0 == 2, displaying scoreboard
        }
        else if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] == 2) {
            // update high scores based on timestamp, looping through, also watch for play again to set scoreboard object [0] 3
            this.displayAndUpdateScores(scene, builderService, fontService, timestamp);
        }
        else if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] == 3) {
            this.refreshPagePlayAgain();
        }
    }
    scoreBoardPostLogic(scoreboardService) {
        // posting score
        scoreboardService.postScoreHelper(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].currWordEntry, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].userScore);
        _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject = [-2];
    }
    getScoreBoardLogic(scene, scoreboardService) {
        // getting scoreboard
        scoreboardService.getScoreBoardHelper();
        let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
        if (timerGroupObj != undefined) {
            timerGroupObj.children.forEach((child, i) => {
                if (child.userData.deleteText != undefined) {
                    child.userData.deleteText();
                }
            });
        }
        let scoreGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreGroupName);
        if (scoreGroup != undefined) {
            scoreGroup.children.forEach((child, i) => {
                if (child.userData.deleteText != undefined) {
                    child.userData.deleteText();
                }
            });
        }
    }
    deleteOldTextLogic(scene) {
        // this: scoreboard object [0] == 1, displaying scoreboard
        let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
        if (timerGroupObj != undefined) {
            if (timerGroupObj.children.length != 0) {
                timerGroupObj.children.forEach((child, i) => {
                    if (child.userData.deleteText != undefined) {
                        child.userData.deleteText();
                    }
                });
            }
        }
        // todo new logic only put in high score if length 0
        //@ts-ignore
        if (timerGroupObj.children.length == 0) {
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] = 2;
        }
    }
    displayAndUpdateScores(scene, builderService, fontService, timestamp) {
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeStampDisplay == -1) {
            // - 2000 to display faster
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeStampDisplay = timestamp - 2500;
            // todo add msg "HIGH SCORES" using environment var not hard code
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].highScoresString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].largeFontSize);
            // todo add msg "PLAY AGAIN" using environment var not hard code
            fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].playAgainString, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.x - _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize * 7, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.y + _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize * 2, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].buttonGroupPos.z * .85), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].xSmallFontSize * .80);
        }
        //                         let scoresList = environment.scoreboardObject[1]
        //@ts-ignore
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex < _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[1].length && timestamp - _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeStampDisplay > 3000) {
            let timerGroupObj = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName);
            if (timerGroupObj != undefined) {
                if (timerGroupObj.children.length != 0) {
                    timerGroupObj.children.forEach((child, i) => {
                        // todo new logic avoid high score string update
                        if (child.userData.deleteText != undefined && child.userData.message != _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].highScoresString) {
                            child.userData.deleteText();
                        }
                    });
                }
            }
            // todo new logic only put in high score if length 0
            //@ts-ignore
            // todo add msg "HIGH SCORES" using environment var not hard code
            let curY = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.y;
            curY -= _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].largeFontSize * 2;
            let scoresList = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[1];
            // todo new logic try to avoid not deleting, cant check if == 0 because high scores object with 2 objects in children list
            //@ts-ignore
            if (timerGroupObj.children.length <= 2) {
                //@ts-ignore
                scoresList.slice(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex + _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreSliceAmt).forEach((scoreInfo, i) => {
                    const nameVal = scoreInfo[1];
                    const scoreVal = scoreInfo[2];
                    // todo new logic incorporate score start index
                    const scoreMsg = String(i + 1 + _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex) + " " + nameVal + ":    " + scoreVal;
                    curY -= _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize * 2;
                    fontService.addFont(scoreMsg, scene, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeWordGroupName, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.x, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.y + curY, _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timerGroupPos.z), _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].smallFontSize);
                });
                // new logic time of displaying last scores
                _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].timeStampDisplay = timestamp;
                // new logic update scoreStartIndex
                _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex += _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreSliceAmt;
                // @ts-ignore
                if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex >= _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[1].length) {
                    //
                    _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreStartIndex = 0;
                }
            }
        }
        builderService.checkLaserKeyboardCollisions(scene);
    }
    refreshPagePlayAgain() {
        window.location.reload();
        // must set scoreboard object to avoid looping and reloading multiple times
        _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject[0] = 4;
    }
}
PostGameHelperService.ɵfac = function PostGameHelperService_Factory(t) { return new (t || PostGameHelperService)(); };
PostGameHelperService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: PostGameHelperService, factory: PostGameHelperService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Oimv":
/*!*******************************************************!*\
  !*** ./src/app/services/scoreboard-helper.service.ts ***!
  \*******************************************************/
/*! exports provided: ScoreboardHelperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScoreboardHelperService", function() { return ScoreboardHelperService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");




class ScoreboardHelperService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getScoreBoard() {
        //     return this.httpClient.get('http://localhost:5000/scoreboard_api/get_scoreboard', {
        return this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboard_get_url, {
            //     return this.httpClient.get('http://localhost:8081/pickle-api', {
            withCredentials: true,
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
                'Content-Type': 'application/json',
                'charset': 'UTF-8'
            })
        });
    }
    getScoreBoardHelper() {
        //     https://stackoverflow.com/a/49605311/10432596
        this.getScoreBoard().subscribe(data => {
            let scoreBoardGet = JSON.parse(JSON.stringify(data));
            _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboardObject = [1, scoreBoardGet];
        });
    }
    postScore(name, score) {
        //     return this.httpClient.post('http://localhost:5000/scoreboard_api/post_score', {
        //     //     return this.httpClient.get('http://localhost:8081/pickle-api', {
        //         withCredentials: true,
        //         nameVal: name,
        //         scoreVal: score,
        //         headers: new HttpHeaders({
        //             'Content-Type': 'application/json',
        //             'charset': 'UTF-8'
        //         })
        //     });
        //     return this.httpClient.post('http://localhost:5000/scoreboard_api/post_score', {
        return this.httpClient.post(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].scoreboard_post_url, {
            //     return this.httpClient.get('http://localhost:8081/pickle-api', {
            nameVal: name,
            scoreVal: score
        });
    }
    postScoreHelper(name, score) {
        this.postScore(name, score).subscribe(data => {
            //         console.log("data")
            //         console.log(data)
        });
    }
}
ScoreboardHelperService.ɵfac = function ScoreboardHelperService_Factory(t) { return new (t || ScoreboardHelperService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"])); };
ScoreboardHelperService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: ScoreboardHelperService, factory: ScoreboardHelperService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AppComponent {
    constructor() {
        this.title = 'threejs-ng-snake';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 8, vars: 0, consts: [[1, "border", 2, "height", "100vh", "max-width", "100vw"], [1, "row", "border", "mx-auto", "mb-5", "p-1", 2, "max-width", "inherit", "background-color", "rgba(229,157,126,0.63)"], [1, "font-monospace", "fw-bolder"], [1, "row", "border", "mx-auto", "p-1", 2, "max-width", "inherit", "background-color", "rgba(229,157,126,0.63)", "min-height", "80%"], [1, "col", "mx-auto", "p-1", 2, "max-width", "inherit"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "head");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "body", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "ThreeJS/Angular/Flask Test Page");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */", "body[_ngcontent-%COMP%] {\n      background: url('https://thumbnails.yayimages.com/1600/0/d99/d9945c.jpg') no-repeat center center fixed;\n      -webkit-background-size: cover;\n      -moz-background-size: cover;\n      background-size: cover;\n      -o-background-size: cover;\n    }"] });


/***/ }),

/***/ "ThSa":
/*!**************************************!*\
  !*** ./src/app/js/TurretControls.js ***!
  \**************************************/
/*! exports provided: TurretControls */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TurretControls", function() { return TurretControls; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/*
* ADAPTION THREEJS FIRST PERSON CONTROLS
*/

const _lookDirection = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
const _spherical = new three__WEBPACK_IMPORTED_MODULE_0__["Spherical"]();
const _target = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
class TurretControls {
    constructor(object, domElement) {
        if (domElement === undefined) {
            console.warn('THREE.TurretControls: The second parameter "domElement" is now mandatory.');
            domElement = document;
        }
        this.object = object;
        this.domElement = domElement;
        // API
        this.enabled = true;
        this.lookSpeed = 0.005;
        this.lookVertical = true;
        this.activeLook = true;
        this.heightSpeed = false;
        this.heightCoef = 1.0;
        this.heightMin = 0.0;
        this.heightMax = 1.0;
        // todo here constrain vertical: only really used look ratio... remove and make own var?
        this.constrainVertical = false;
        this.verticalMin = 0;
        this.verticalMax = Math.PI;
        this.mouseDragOn = false;
        // todo here preAddCopy, targetCopy only used helper
        this.CameraHelpers = false;
        this.targetCopy = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        this.preAddCopy = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        // internals
        this.autoSpeedFactor = 0.0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.viewHalfX = 0;
        this.viewHalfY = 0;
        // private variables
        let lat = 0;
        let lon = 0;
        //
        this.handleResize = function () {
            if (this.domElement === document) {
                this.viewHalfX = window.innerWidth / 2;
                this.viewHalfY = window.innerHeight / 2;
            }
            else {
                this.viewHalfX = this.domElement.offsetWidth / 2;
                this.viewHalfY = this.domElement.offsetHeight / 2;
            }
        };
        this.onMouseMove = function (event) {
            if (this.domElement === document) {
                this.mouseX = event.pageX - this.viewHalfX;
                this.mouseY = event.pageY - this.viewHalfY;
            }
            else {
                this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
                this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
            }
        };
        this.onMouseLeave = function (event) {
            // todo need to see usage of this, likely unneeded else if
            if (this.domElement === document) {
                this.enabled = false;
            }
            else {
                this.enabled = false;
            }
        };
        this.onMouseEnter = function (event) {
            if (this.domElement === document) {
                this.enabled = true;
            }
            else {
                this.enabled = true;
            }
        };
        this.lookAt = function (x, y, z) {
            if (x.isVector3) {
                _target.copy(x);
            }
            else {
                _target.set(x, y, z);
            }
            this.object.lookAt(_target);
            setOrientation(this);
            return this;
        };
        this.update = function () {
            const targetPosition = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
            return function update(delta) {
                if (this.enabled === false)
                    return;
                if (this.heightSpeed) {
                    const y = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].clamp(this.object.position.y, this.heightMin, this.heightMax);
                    const heightDelta = y - this.heightMin;
                    this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
                }
                else {
                    this.autoSpeedFactor = 0.0;
                }
                let actualLookSpeed = delta * this.lookSpeed;
                if (!this.activeLook) {
                    actualLookSpeed = 0;
                }
                let verticalLookRatio = 1;
                if (this.constrainVertical) {
                    verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
                }
                // todo here new change with ratio for lon added
                lon -= this.mouseX * actualLookSpeed;
                //				lon -= this.mouseX * actualLookSpeed * verticalLookRatio;
                if (this.lookVertical)
                    lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
                // todo here should make new variables for max movement any dir
                lat = Math.max(-35, Math.min(25, lat));
                let phi = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(90 - lat);
                // todo new lon logic... angle from z+ axis?
                lon = Math.max(130, Math.min(235, lon));
                const theta = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(lon);
                // todo here: removed logic for this constrain vertical; maybe just make look ratio own variable?
                //				if ( this.constrainVertical ) {
                ////					phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
                //				}
                const position = this.object.position;
                // todo here preAddCopy only used helper
                if (this.CameraHelpers == true) {
                    this.preAddCopy.setFromSphericalCoords(1, phi, theta);
                }
                targetPosition.setFromSphericalCoords(1, phi, theta).add(position);
                this.object.lookAt(targetPosition);
                //				// todo here targetCopy only used helper
                if (this.CameraHelpers == true) {
                    this.targetCopy.copy(targetPosition);
                }
                return targetPosition;
            };
        }();
        this.dispose = function () {
            this.domElement.removeEventListener('contextmenu', contextmenu);
            this.domElement.removeEventListener('mousemove', _onMouseMove);
            this.domElement.removeEventListener('mouseleave', _onMouseLeave);
            this.domElement.removeEventListener('mouseenter', _onMouseEnter);
        };
        const _onMouseMove = this.onMouseMove.bind(this);
        const _onMouseLeave = this.onMouseLeave.bind(this);
        const _onMouseEnter = this.onMouseEnter.bind(this);
        this.domElement.addEventListener('contextmenu', contextmenu);
        this.domElement.addEventListener('mousemove', _onMouseMove);
        this.domElement.addEventListener('mouseleave', _onMouseLeave);
        this.domElement.addEventListener('mouseenter', _onMouseEnter);
        function setOrientation(controls) {
            const quaternion = controls.object.quaternion;
            _lookDirection.set(0, 0, -1).applyQuaternion(quaternion);
            _spherical.setFromVector3(_lookDirection);
            lat = 90 - three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].radToDeg(_spherical.phi);
            lon = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].radToDeg(_spherical.theta);
        }
        this.handleResize();
        setOrientation(this);
    }
}
function contextmenu(event) {
    event.preventDefault();
}



/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _canvas_comp_canvas_comp_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./canvas-comp/canvas-comp.component */ "mmR8");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./not-found/not-found.component */ "nod/");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _canvas_comp_canvas_comp_component__WEBPACK_IMPORTED_MODULE_4__["CanvasCompComponent"],
        _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_5__["NotFoundComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"]] }); })();


/***/ }),

/***/ "lG+f":
/*!*************************************!*\
  !*** ./src/app/word-api.service.ts ***!
  \*************************************/
/*! exports provided: WordApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WordApiService", function() { return WordApiService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");



// https://stackoverflow.com/questions/53341497/flask-session-not-persisting-between-requests-for-angular-app
class WordApiService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getWord() {
        return this.httpClient.get('http://localhost:5000/pickle-api', {
            //     return this.httpClient.get('http://localhost:8081/pickle-api', {
            withCredentials: true,
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
                'Content-Type': 'application/json',
                'charset': 'UTF-8'
            })
        });
    }
}
WordApiService.ɵfac = function WordApiService_Factory(t) { return new (t || WordApiService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"])); };
WordApiService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: WordApiService, factory: WordApiService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "mmR8":
/*!******************************************************!*\
  !*** ./src/app/canvas-comp/canvas-comp.component.ts ***!
  \******************************************************/
/*! exports provided: CanvasCompComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasCompComponent", function() { return CanvasCompComponent; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _js_stats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js/stats */ "qWkO");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _word_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../word-api.service */ "lG+f");
/* harmony import */ var _services_obj_builder_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/obj-builder.service */ "yXZF");
/* harmony import */ var _services_scene_helper_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/scene-helper.service */ "oeSX");
/* harmony import */ var _services_font_builder_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/font-builder.service */ "9ecQ");
/* harmony import */ var _services_scoreboard_helper_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/scoreboard-helper.service */ "Oimv");
/* harmony import */ var _services_post_game_helper_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/post-game-helper.service */ "LlEI");
// todo new logic refresh










class CanvasCompComponent {
    // todo new logic game stop time
    //     private gameStopTime = 0
    //
    //     private sceneService: any = undefined;
    constructor(wordService, builderService, sceneService, fontService, scoreboardService, postGameHelper) {
        this.wordService = wordService;
        this.builderService = builderService;
        this.sceneService = sceneService;
        this.fontService = fontService;
        this.scoreboardService = scoreboardService;
        this.postGameHelper = postGameHelper;
        this.shapesArray = [];
        // todo here all arrows: just helpers
        this.cameraHelpers = false;
        // helper bool box helpers render material
        this.boxHelpers = false;
        // helper bool for rotation and direction helper arrows
        this.directionHelpers = false;
        //
        this.axesHelperBool = false;
        this.gridHelperBool = false;
        //
        this.lightDirHelper = false;
        this.laserTest = false;
        // todo timer
        this.lastSecondStart = 0;
        this.timerElapsed = 0;
        this.timerMax = 46;
        this.userScorePrev = -1;
        // todo new logic rotation timing
        this.lastRotationStart = 0;
        // todo new logic refresh timing
        this.lastKeyRefresh = 0;
        this.scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
        // HELPERS:
        const axesSize = 10;
        const centerColor = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(0, 0, 255)');
        if (this.axesHelperBool == true) {
            this.axesHelper = new three__WEBPACK_IMPORTED_MODULE_0__["AxesHelper"](axesSize);
            const zColor = new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(0, 50, 100)');
            this.axesHelper.setColors(centerColor, zColor, centerColor);
            this.scene.add(this.axesHelper);
        }
        if (this.gridHelperBool == true) {
            this.gridHelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](axesSize, axesSize, centerColor);
            this.scene.add(this.gridHelper);
        }
        // MAIN CAMERA
        this.camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](60, 800 / 600);
        // START: USED FOR TIMING
        this.start = -1;
        // INITIALIZE LIGHTS AND FOG
        this.sceneService.initLights(this.scene, this.lightDirHelper);
        this.sceneService.initFog(this.scene);
        // INITIAL TEXT AND BUTTON OBJECTS
        // title group
        this.sceneService.initSceneGroup(this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wordGroupName);
        this.fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].titleString, this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wordGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].largeFontSize);
        // timer group
        this.sceneService.initSceneGroup(this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].timeWordGroupName);
        // score group
        this.sceneService.initSceneGroup(this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].scoreGroupName);
        // start button
        this.sceneService.initSceneGroup(this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupName);
        this.fontService.addFont(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].startString, this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].xSmallFontSize);
        // CLOCK OBJECT FOR DELTA
        this.clock = new three__WEBPACK_IMPORTED_MODULE_0__["Clock"]();
        // necessary to enable "this" keyword to work correctly inside animate
        this.animate = this.animate.bind(this);
    }
    // @ts-ignore
    animate(timestamp) {
        // INITIALIZE TIME OBJECTS IN ANIMATION LOOP
        // start object: used to calculate elapsed time
        if (this.start === -1) {
            this.start = timestamp;
            this.lastSecondStart = timestamp;
            this.lastRotationStart = timestamp;
            this.lastKeyRefresh = timestamp;
            //             this.last = timestamp;
        }
        const elapsed = timestamp - this.start;
        const delta = this.clock.getDelta();
        // controls update: necessary for damping orbit controls
        // note: controls target, useful
        let controlsTarget = this.controls.update(delta);
        // logic for updating controls reticule, target is a sprite
        if (controlsTarget != undefined) {
            this.sceneService.updateReticuleSprite(this.scene, this.camera, controlsTarget);
        }
        // logic for timer, game going on, only update timer every second
        if ((elapsed - this.lastSecondStart) > 950 && _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode == "") {
            let timerGroupObj = this.scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].timeWordGroupName);
            if (timerGroupObj != undefined) {
                if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart == true) {
                    this.timerElapsed += 1;
                    timerGroupObj.children.forEach((child, i) => {
                        if (child.userData.deleteText != undefined) {
                            child.userData.deleteText();
                        }
                    });
                    timerGroupObj.children = [];
                    if (this.timerMax - this.timerElapsed != 0) {
                        this.fontService.addFont(String(this.timerMax - this.timerElapsed), this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].timeWordGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].timerGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].largeFontSize);
                    }
                    this.lastSecondStart = timestamp;
                }
                if (this.timerMax - this.timerElapsed <= 0 && _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart == true) {
                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart = false;
                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].modeName1;
                    timerGroupObj.children.forEach((child) => {
                        child.userData.deleteText();
                    });
                    timerGroupObj.children = [];
                    this.timerElapsed += 1;
                }
            }
        }
        // todo new logic exclude game mode 3 gameplay else refresh
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode != _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].modeName2 && (timestamp - this.lastKeyRefresh) > _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].keyRefreshRate) {
            this.lastKeyRefresh = timestamp;
            // todo new logic refresh button color
            let buttonGroup = this.scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupName);
            if (buttonGroup != undefined) {
                buttonGroup.children.forEach((child) => {
                    if (child.userData.refreshTextWireframe != undefined) {
                        child.userData.refreshTextWireframe();
                    }
                });
            }
        }
        let scoreGroup = this.scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].scoreGroupName);
        if (scoreGroup != undefined && this.userScorePrev != _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].userScore && _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart == true) {
            this.userScorePrev = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].userScore;
            scoreGroup.children.forEach((child, i) => {
                if (child.userData.deleteText != undefined) {
                    child.userData.deleteText();
                }
            });
            scoreGroup.children = [];
            this.fontService.addFont(String(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].userScore), this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].scoreGroupName, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].scoreGroupPos, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].largeFontSize);
        }
        // logic arrow helpers
        if (this.cameraHelpers == true) {
            let [cA, pA, oA, aA] = this.sceneService.updateCameraHelpers(this.scene, this.controls, this.controlArrow, this.posArrow, this.oldArrow, this.addArrow);
            this.controlArrow = cA;
            this.posArrow = pA;
            this.oldArrow = oA;
            this.addArrow = aA;
        }
        // main logic asteroids
        if (timestamp - this.lastRotationStart > _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].rotationFramerate) {
            this.lastRotationStart = timestamp;
            // spin each asteroid and rotate around center y axis
            this.shapesArray.forEach((asteroid, index) => {
                // todo new logic here using asteroid user data spin, now set using min and max vars for radius and spin
                asteroid.shapeObj.rotateY(asteroid.shapeObj.userData.spin);
                asteroid.shapeObj.rotateZ(asteroid.shapeObj.userData.spin / 5);
                // set asteroid direction, also update rotation helper if necessary
                asteroid.setAsteroidDirection();
                // update box helper, or box helper won't change in size with rotation etc
                asteroid.updateBoxHelper();
                this.builderService.checkConflicts(asteroid, this.shapesArray, index, this.scene, this.boxHelpers);
            });
        }
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode != "") {
            this.postGameHelper.postGameRouter(this.scene, timestamp, this.builderService, this.scoreboardService, this.fontService);
        }
        // update laser: init new, set depleted, check max distance and delete
        this.sceneService.updateLaser(this.scene, controlsTarget);
        this.builderService.checkLaserCollisions(this.shapesArray, this.scene, this.boxHelpers);
        this.render_all();
        this.stats.update();
        requestAnimationFrame(this.animate);
    }
    window_set_size() {
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        const pixelRatio = window.devicePixelRatio;
        // @ts-ignore
        const HEIGHT = document.getElementById('mainCanvas').clientHeight * pixelRatio;
        // @ts-ignore
        const WIDTH = document.getElementById('mainCanvas').clientWidth * pixelRatio;
        this.renderer.setSize(WIDTH, HEIGHT);
        this.camera.aspect = WIDTH / HEIGHT;
        this.camera.updateProjectionMatrix();
    }
    window_size_listener() {
        window.addEventListener('resize', () => {
            this.window_set_size();
        });
    }
    render_all() {
        this.renderer.render(this.scene, this.camera);
    }
    ngOnInit() {
        let canvas = document.querySelector('canvas.draw');
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({
            antialias: true,
            logarithmicDepthBuffer: false,
            canvas: canvas
        });
        this.renderer.shadowMap.enabled = true;
        // @ts-ignore
        this.renderer.setClearColor(this.scene.fog.color);
        //https://stackoverflow.com/questions/15409321/super-sample-antialiasing-with-threejs
        //https://r105.threejsfundamentals.org/threejs/lessons/threejs-responsive.html
        // set pixel ratio not recommended
        //         this.renderer.setPixelRatio(window.devicePixelRatio*1.25)
        this.sceneService.initCameras(this.scene, this.camera);
        this.sceneService.initStars(this.scene, this.camera.position);
        this.controls = this.sceneService.initControls(this.scene, this.camera);
        this.sceneService.initReticuleSprite(this.scene, this.camera, this.controls);
        // todo new logic grouping lasers
        // todo new logic renaming this and using generalized name
        //         this.sceneService.initLaserGroup(this.scene)
        this.sceneService.initSceneGroup(this.scene, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].laserGroupName);
        // main logic
        this.window_set_size();
        this.window_size_listener();
        // todo : logic init asteroids, don't need to pass in anything but scene after using scene group logic
        this.builderService.initBoxes(this.shapesArray, this.scene, this.boxHelpers, this.directionHelpers);
        // arrow helper logic
        if (this.cameraHelpers == true) {
            this.controls.cameraHelpers = true;
            let [cA, pA, oA, aA] = this.sceneService.initCameraHelpers(this.scene, this.controls, this.controlArrow, this.posArrow, this.oldArrow, this.addArrow);
            this.controlArrow = cA;
            this.posArrow = pA;
            this.oldArrow = oA;
            this.addArrow = aA;
        }
        //fps helper logic
        // https://subscription.packtpub.com/book/web-development/9781783981182/1/ch01lvl1sec15/determining-the-frame-rate-for-your-scene
        {
            // @ts-ignore
            this.stats = new _js_stats__WEBPACK_IMPORTED_MODULE_1__["Stats"]();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '5vh';
            this.stats.domElement.style.top = "80vh";
            document.body.appendChild(this.stats.domElement);
        }
        /* Mouse clicking handling */
        canvas.addEventListener('click', (evt) => this.sceneService.updateClickedTrue(this.scene));
        requestAnimationFrame(this.animate);
    }
}
CanvasCompComponent.ɵfac = function CanvasCompComponent_Factory(t) { return new (t || CanvasCompComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_word_api_service__WEBPACK_IMPORTED_MODULE_4__["WordApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_obj_builder_service__WEBPACK_IMPORTED_MODULE_5__["ObjBuilderService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_scene_helper_service__WEBPACK_IMPORTED_MODULE_6__["SceneHelperService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_font_builder_service__WEBPACK_IMPORTED_MODULE_7__["FontBuilderService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_scoreboard_helper_service__WEBPACK_IMPORTED_MODULE_8__["ScoreboardHelperService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_post_game_helper_service__WEBPACK_IMPORTED_MODULE_9__["PostGameHelperService"])); };
CanvasCompComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: CanvasCompComponent, selectors: [["app-canvas-comp"]], decls: 2, vars: 0, consts: [[1, "col", "mx-auto", 2, "max-width", "100%", "height", "100%", "background-color", "inherit"], ["id", "mainCanvas", 1, "draw", "row", "mx-auto", 2, "max-width", "inherit", "height", "inherit", "cursor", "none"]], template: function CanvasCompComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "canvas", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } }, encapsulation: 2 });


/***/ }),

/***/ "nod/":
/*!**************************************************!*\
  !*** ./src/app/not-found/not-found.component.ts ***!
  \**************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class NotFoundComponent {
    constructor() { }
    ngOnInit() {
    }
}
NotFoundComponent.ɵfac = function NotFoundComponent_Factory(t) { return new (t || NotFoundComponent)(); };
NotFoundComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NotFoundComponent, selectors: [["app-not-found"]], decls: 3, vars: 0, consts: [[1, "row"]], template: function NotFoundComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Not found ya dingus");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, encapsulation: 2 });


/***/ }),

/***/ "oeSX":
/*!**************************************************!*\
  !*** ./src/app/services/scene-helper.service.ts ***!
  \**************************************************/
/*! exports provided: SceneHelperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SceneHelperService", function() { return SceneHelperService; });
/* harmony import */ var _js_TurretControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/TurretControls */ "ThSa");
/* harmony import */ var _classes_laser_ray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/laser-ray */ "9PKO");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");





class SceneHelperService {
    constructor() {
        this.checked = false;
        this.targetAxes = undefined;
        this.clicked = false;
    }
    generateStarPosition(min_rad) {
        let vertAngle = three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].degToRad(three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].mapLinear(Math.random(), 0, 1, 0, 360.0));
        let horzAngle = three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].degToRad(three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].mapLinear(Math.random(), 0, 1, 0, 360.0));
        let ranVec = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](Math.cos(vertAngle) * Math.cos(horzAngle), Math.sin(vertAngle), Math.sin(horzAngle) * Math.cos(vertAngle));
        ranVec.normalize();
        ranVec.setLength(min_rad + Math.random() * min_rad);
        ranVec.setLength(three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].mapLinear(Math.random(), 0, 1, min_rad, min_rad * 1.5));
        return ranVec;
    }
    initStars(scene, camera_position) {
        const verts = [];
        const sizes = [];
        const num_stars = 10000;
        const min_pos_radius = camera_position.length();
        const starSprite = new three__WEBPACK_IMPORTED_MODULE_2__["TextureLoader"]().load('assets/disc.png');
        const min_star_size = .002;
        const max_star_size = .01;
        for (let i = 0; i < num_stars; i++) {
            let temp_vec = this.generateStarPosition(min_pos_radius);
            verts.push(temp_vec.x, temp_vec.y, temp_vec.z);
            let star_size = three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].mapLinear(Math.random(), 0, 1, min_star_size, max_star_size);
            // modifier: goal: closer stars are smaller size
            let temp_dist_modifier = Math.pow((temp_vec.distanceTo(camera_position) / min_pos_radius), 2);
            sizes.push(star_size * temp_dist_modifier);
            //             sizes.push(star_size)
        }
        const geo = new three__WEBPACK_IMPORTED_MODULE_2__["BufferGeometry"]();
        geo.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__["Float32BufferAttribute"](verts, 3));
        //         geo.setAttribute('size', new THREE.Float32BufferAttribute( [.2], 1))
        geo.setAttribute('size', new three__WEBPACK_IMPORTED_MODULE_2__["Float32BufferAttribute"](sizes, 1));
        //         const material = new THREE.PointsMaterial({color: new THREE.Color('rgb(255, 255, 255)')})
        const material = new three__WEBPACK_IMPORTED_MODULE_2__["PointsMaterial"]({ size: .1, map: starSprite, transparent: true, alphaTest: .2 });
        const points = new three__WEBPACK_IMPORTED_MODULE_2__["Points"](geo, material);
        scene.add(points);
    }
    initLights(scene, dirHelperBool) {
        // light
        {
            const colorAmb = new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(204,243,251)');
            const intensity = .5;
            const ambLight = new three__WEBPACK_IMPORTED_MODULE_2__["AmbientLight"](colorAmb, intensity);
            scene.add(ambLight);
            //           this.scene.add(ambLight);
        }
        // light 2
        // todo make class variables or add names?
        {
            //             const colorDir = new THREE.Color('rgb(255,200,255)');
            const colorDir = new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(243,233,155)');
            const intensityDir = .8;
            const lightDir = new three__WEBPACK_IMPORTED_MODULE_2__["DirectionalLight"](colorDir, intensityDir);
            lightDir.position.set(3, 2, 3);
            lightDir.target.position.set(0, 0, 0);
            scene.add(lightDir);
            //           this.scene.add(lightDir);
            if (dirHelperBool == true) {
                const lightDirHelper = new three__WEBPACK_IMPORTED_MODULE_2__["DirectionalLightHelper"](lightDir);
                scene.add(lightDirHelper);
            }
            //           this.scene.add(lightDirHelper);
        }
    }
    initFog(scene) {
        // fog
        {
            const color = new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(34,32,50)');
            const near = 1;
            //             const far = 21;
            const far = 16;
            scene.fog = new three__WEBPACK_IMPORTED_MODULE_2__["Fog"](color, near, far);
            scene.background = color;
        }
    }
    initCameras(scene, camera) {
        //         camera.position.z = 8;
        // //         camera.position.z = 5;
        //         camera.position.x = 0;
        //         camera.position.y = 1.2;
        // todo use new environmental variable for this
        camera.position.x = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].cameraPos.x;
        camera.position.y = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].cameraPos.y;
        camera.position.z = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].cameraPos.z;
        camera.name = "turretCamera";
        scene.add(camera);
    }
    initControls(scene, camera) {
        const domElement = document.querySelector('canvas.draw');
        //         https://en.threejs-university.com/2021/09/16/easily-moving-the-three-js-camera-with-orbitcontrols-and-mapcontrols/
        //         https://threejs.org/docs/#examples/en/controls/OrbitControls
        //first person controls and configuration
        let controls = new _js_TurretControls__WEBPACK_IMPORTED_MODULE_0__["TurretControls"](camera, domElement);
        controls.lookSpeed = .35;
        controls.constrainVertical = true;
        controls.verticalMin = 1 * Math.PI / 8;
        //         controls.verticalMin = 1
        controls.verticalMax = 7 * Math.PI / 8;
        //         controls.verticalMax = 3.14
        return controls;
    }
    initCameraHelpers(scene, controls, controlArrow, posArrow, oldArrow, addArrow) {
        // helper arrow target
        const origin = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](-1, 0, 0);
        const length = controls.targetCopy.length();
        controlArrow = new three__WEBPACK_IMPORTED_MODULE_2__["ArrowHelper"](controls.targetCopy.normalize(), origin, length, new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(150, 0,0)'));
        scene.add(controlArrow);
        // helper arrow position controls
        let posCopy = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](0, 0, 0);
        posCopy.copy(controls.object.position);
        posCopy.normalize();
        posArrow = new three__WEBPACK_IMPORTED_MODULE_2__["ArrowHelper"](posCopy, origin, controls.object.position.length(), new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(0, 100, 150)'));
        scene.add(posArrow);
        let oldLength = controls.preAddCopy.length();
        let preAddCache = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"]();
        preAddCache.copy(controls.preAddCopy);
        oldArrow = new three__WEBPACK_IMPORTED_MODULE_2__["ArrowHelper"](controls.preAddCopy.normalize(), origin, oldLength, new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(0, 240,0)'));
        scene.add(oldArrow);
        let addPos = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"]();
        addPos.copy(posCopy).add(preAddCache);
        let addLength = addPos.length();
        addArrow = new three__WEBPACK_IMPORTED_MODULE_2__["ArrowHelper"](addPos.normalize(), new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](preAddCache.x, preAddCache.y, preAddCache.z), addLength, new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(100, 100, 100)'));
        scene.add(addArrow);
        return [controlArrow, posArrow, oldArrow, addArrow];
    }
    updateCameraHelpers(scene, controls, controlArrow, posArrow, oldArrow, addArrow) {
        // todo helpers below: all arrows only ... could be added separate function
        // todo new helper logic
        controlArrow.setLength(controls.targetCopy.length(), 
        // @ts-ignore
        controlArrow.headLength, .15);
        controlArrow.setDirection(controls.targetCopy.normalize());
        // todo below: just calculation using angle target vector and Y axis
        let Yval = controls.targetCopy.y;
        let radTheta = Math.acos(Yval / controls.targetCopy.length());
        let thetaY = three__WEBPACK_IMPORTED_MODULE_2__["MathUtils"].radToDeg(radTheta);
        let addPos = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"]();
        addPos.copy(controls.object.position);
        scene.remove(addArrow);
        let addLength = addPos.length();
        addArrow = new three__WEBPACK_IMPORTED_MODULE_2__["ArrowHelper"](addPos.normalize(), new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](controls.preAddCopy.x - 1, controls.preAddCopy.y, controls.preAddCopy.z), addLength, new three__WEBPACK_IMPORTED_MODULE_2__["Color"]('rgb(100, 100, 100)'));
        addArrow.setLength(addLength);
        scene.add(addArrow);
        oldArrow.setLength(controls.preAddCopy.length(), 
        // @ts-ignore
        controls.preAddCopy.headLength, .15);
        oldArrow.setDirection(controls.preAddCopy.normalize());
        let posCopy = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"](0, 0, 0);
        posCopy.copy(controls.object.position);
        posCopy.normalize();
        posArrow.setLength(controls.object.position.length() * .95, 
        // @ts-ignore
        posArrow.headLength, .08);
        posArrow.setDirection(posCopy);
        return [controlArrow, posArrow, oldArrow, addArrow];
    }
    //     public initReticuleSprite(scene:THREE.Scene, camera:THREE.PerspectiveCamera){
    initReticuleSprite(scene, camera, controls) {
        const sprite_uri = ".\\assets\\reticule_small_lens_color.png";
        let sprite_map = new three__WEBPACK_IMPORTED_MODULE_2__["TextureLoader"]().load(sprite_uri);
        let material = new three__WEBPACK_IMPORTED_MODULE_2__["SpriteMaterial"]({ map: sprite_map,
            color: 0xffffff,
            transparent: true,
            opacity: .7
        });
        let reticule_sprite = new three__WEBPACK_IMPORTED_MODULE_2__["Sprite"](material);
        reticule_sprite.scale.set(.075, .075, 1);
        //         reticule_sprite.scale.set(.1, .1, 1)
        reticule_sprite.position.copy(camera.position);
        reticule_sprite.lookAt(camera.position);
        reticule_sprite.translateZ(-1);
        reticule_sprite.name = "reticule";
        scene.add(reticule_sprite);
    }
    updateReticuleSprite(scene, camera, targetPosition) {
        let reticule_sprite = scene.getObjectByName('reticule');
        reticule_sprite.position.copy(camera.position);
        reticule_sprite.lookAt(camera.position);
        let targetAxes = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"]().copy(targetPosition).sub(camera.position);
        //         reticule_sprite.translateOnAxis(targetAxes, 1)
        reticule_sprite.translateOnAxis(targetAxes, .25);
        reticule_sprite.setRotationFromEuler(camera.rotation);
    }
    updateClickedTrue(scene) {
        if (this.checked == true && this.clicked == false) {
            // todo new logic check if charged before setting clicked true
            if (_classes_laser_ray__WEBPACK_IMPORTED_MODULE_1__["LaserRay"].checkIfCharged() == true) {
                this.clicked = true;
            }
            //             let laser:any = scene.getObjectByName("blueLaser")
            //             laser.visible = true
        }
    }
    // todo new logic: generalize group creation
    //     public initLaserGroup(scene:THREE.Scene){
    initSceneGroup(scene, name) {
        let laserGroup = new three__WEBPACK_IMPORTED_MODULE_2__["Group"]();
        //         laserGroup.name = "laserGroup"
        laserGroup.name = name;
        scene.add(laserGroup);
    }
    //     public initLaser(scene:THREE.Scene){
    // todo new logic add target when creating laser to add to user data in mesh
    initLaser(scene, targetAxes) {
        let camera = scene.getObjectByName("turretCamera");
        let blueLaser = new _classes_laser_ray__WEBPACK_IMPORTED_MODULE_1__["LaserRay"](camera, targetAxes);
        // todo new logic use environment variable for laser group
        //         let laserGroup = scene.getObjectByName("laserGroup")
        let laserGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].laserGroupName);
        if (laserGroup != undefined) {
            laserGroup.add(blueLaser.laserSprite);
        }
    }
    updateLaser(scene, controlsTarget) {
        let camera = scene.getObjectByName("turretCamera");
        if (camera != undefined && controlsTarget != undefined) {
            // todo break this into new function inside laser?
            if (this.checked == false) {
                this.checked = true;
            }
            //             if(this.checked == true && this.clicked == true){
            // todo new logic game start
            //             if(this.checked == true && this.clicked == true && environment.gameStart == true){
            if (this.checked == true && this.clicked == true) {
                let targetAxes = new three__WEBPACK_IMPORTED_MODULE_2__["Vector3"]().copy(controlsTarget).sub(camera.position).normalize();
                // create laser and add to group
                this.initLaser(scene, targetAxes);
                // set clicked to false TODO add cooldown
                this.clicked = false;
                // todo new logic: set laser depleted
                _classes_laser_ray__WEBPACK_IMPORTED_MODULE_1__["LaserRay"].setDepleted();
            }
        }
        // todo new logic use environment variable for group name
        let laserGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].laserGroupName);
        if (laserGroup != undefined) {
            if (camera != undefined) {
                const maxLaserDist = camera.position.length() * 1.2;
                laserGroup.children.forEach((blueLaser, index) => {
                    blueLaser.userData.updateLaserPosition();
                    // calculate laser distance and compare to camera, remove laser after travel distance is camera
                    //  position length or longer
                    if (blueLaser.userData.getLaserTravelDistance(camera) >= maxLaserDist) {
                        blueLaser.userData.deleteLaser();
                    }
                });
            }
        }
    }
}
SceneHelperService.ɵfac = function SceneHelperService_Factory(t) { return new (t || SceneHelperService)(); };
SceneHelperService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({ token: SceneHelperService, factory: SceneHelperService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "qWkO":
/*!*****************************!*\
  !*** ./src/app/js/stats.js ***!
  \*****************************/
/*! exports provided: Stats */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stats", function() { return Stats; });
/**
 * @author mrdoob / http://mrdoob.com/
 */
var Stats = function () {
    var mode = 0;
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    container.addEventListener('click', function (event) {
        event.preventDefault();
        showPanel(++mode % container.children.length);
    }, false);
    //
    function addPanel(panel) {
        container.appendChild(panel.dom);
        return panel;
    }
    function showPanel(id) {
        for (var i = 0; i < container.children.length; i++) {
            container.children[i].style.display = i === id ? 'block' : 'none';
        }
        mode = id;
    }
    //
    var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
    var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
    var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));
    if (self.performance && self.performance.memory) {
        var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
    }
    showPanel(0);
    return {
        REVISION: 16,
        dom: container,
        addPanel: addPanel,
        showPanel: showPanel,
        begin: function () {
            beginTime = (performance || Date).now();
        },
        end: function () {
            frames++;
            var time = (performance || Date).now();
            msPanel.update(time - beginTime, 200);
            if (time >= prevTime + 1000) {
                fpsPanel.update((frames * 1000) / (time - prevTime), 100);
                prevTime = time;
                frames = 0;
                if (memPanel) {
                    var memory = performance.memory;
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                }
            }
            return time;
        },
        update: function () {
            beginTime = this.end();
        },
        // Backwards Compatibility
        domElement: container,
        setMode: showPanel
    };
};
Stats.Panel = function (name, fg, bg) {
    var min = Infinity, max = 0, round = Math.round;
    var PR = round(window.devicePixelRatio || 1);
    var WIDTH = 80 * PR, HEIGHT = 48 * PR, TEXT_X = 3 * PR, TEXT_Y = 2 * PR, GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR, GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
    var canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';
    var context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';
    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    return {
        dom: canvas,
        update: function (value, maxValue) {
            min = Math.min(min, value);
            max = Math.max(max, value);
            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);
            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }
    };
};



/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _canvas_comp_canvas_comp_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas-comp/canvas-comp.component */ "mmR8");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./not-found/not-found.component */ "nod/");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");





const routes = [
    { path: '', component: _canvas_comp_canvas_comp_component__WEBPACK_IMPORTED_MODULE_1__["CanvasCompComponent"], pathMatch: 'full' },
    { path: '**', component: _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_2__["NotFoundComponent"] }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "wY2j":
/*!*********************************************!*\
  !*** ./src/app/environments/environment.ts ***!
  \*********************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");

const environment = {
    // production: built in to environment threejs
    production: false,
    // gamestart: determine to display timer
    gameStart: false,
    // fonts for words
    fontUri: '..\\assets\\helvetiker_regular.typeface.json',
    // wordtest group: demo name on top, asteroid demo title
    wordGroupName: "wordTestGroup",
    wordGroupPos: new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](-2, 2, 0),
    // timer word object
    timeWordGroupName: "timerGroup",
    timerGroupPos: new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](-.25, .5, 0),
    // user score for asteroids
    userScore: 0,
    scoreGroupName: "wordScoreGroup",
    scoreGroupPos: new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](-.25, 1.4, 0),
    // laser group
    laserGroupName: "laserGroup",
    keyRefreshRate: 200,
    // todo new logic button group with fonts
    buttonGroupName: "buttonGroup",
    //     buttonGroupPos: new Vector3(-.25, .25, 5),
    // todo new logic moving keys closer and smaller
    buttonGroupPos: new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](-.25, .35, 6),
    // post_game_mode : avoid if statements using environment
    // Undefined, TimesUp, Entry, Scoreboard
    postGameMode: "",
    modeName1: "TimesUp",
    modeName2: "EntryStart",
    modeName3: "NameEntrykeyboard",
    modeName4: "Scoreboard",
    // todo new logic word alphabet for keyboard
    keysAlphabet: (String.fromCharCode(...Array(123).keys()).slice(65, 91) + String.fromCharCode(...Array(123).keys()).slice(48, 58)).split(''),
    // todo new logic big and small font size
    largeFontSize: .4,
    smallFontSize: .2,
    xSmallFontSize: .1,
    // todo new logic currWord
    currWordEntry: "",
    maxEntryLength: 8,
    scoreboardObject: [-1, undefined],
    // todo new logic limit number of high scores displayed
    scoreStartIndex: 0,
    scoreSliceAmt: 10,
    timeStampDisplay: -1,
    // todo new logic avoid hardcoding strings
    titleString: "Asteroids 3D",
    nameEntryString: "NAME: ",
    highScoresString: "HIGH SCORES",
    playAgainString: "PLAY AGAIN",
    startString: "START",
    enterString: "ENTER",
    deleteString: "DEL",
    // asteroid global params
    min_asteroid_radius: .02,
    max_asteroid_radius: .3,
    asteroid_distance_modifier: .35,
    // rotation on own axis
    min_asteroid_spin: .006,
    max_asteroid_spin: .02,
    max_asteroids: 100,
    // todo testing this, limit rotation speed if faster system
    // higher values slow asteroids
    rotationFramerate: 5,
    // todo new logic camera pos
    cameraPos: new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1.2, 8),
    // todo new logic move post-game vars here
    gameStopTime: 0,
    // scoreboard service
    scoreboard_post_url: 'http://localhost:5000/scoreboard_api/post_score',
    scoreboard_get_url: 'http://localhost:5000/scoreboard_api/get_scoreboard'
};
//         const fontUri = '..\\assets\\Gravity_Bold.json'


/***/ }),

/***/ "yXZF":
/*!*************************************************!*\
  !*** ./src/app/services/obj-builder.service.ts ***!
  \*************************************************/
/*! exports provided: ObjBuilderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjBuilderService", function() { return ObjBuilderService; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "Womt");
/* harmony import */ var _classes_random_shape_class_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/random-shape-class.model */ "Le96");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../environments/environment */ "wY2j");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");




class ObjBuilderService {
    constructor() { }
    // todo here take boxhelpers as param
    initBoxes(shapesArray, scene, boxHelpers, directionHelpers) {
        for (let i = 0; i < _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids; i++) {
            // blueCol/greenCol: change color of asteroid based on position in list of all asteroids
            //  the higher the index, the more intense the color
            // todo new logic enviro var
            const blueCol = 255 - Math.floor(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids, 20, 60));
            const greenCol = 215 - Math.floor(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids, 20, 100));
            const redCol = 140 - Math.floor(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids, 20, 30));
            let material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshPhongMaterial"]({
                color: new three__WEBPACK_IMPORTED_MODULE_0__["Color"]('rgb(' + redCol + ',' + greenCol + ',' + blueCol + ')'),
                //                                      side: THREE.DoubleSide
                side: three__WEBPACK_IMPORTED_MODULE_0__["FrontSide"]
            });
            // todo new logic using environment var for radius
            let box_rad = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].min_asteroid_radius, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroid_radius);
            // todo new logic use environment var for max radius
            //             let pos = this.generatePosition(environment.max_asteroid_radius)
            let pos = this.generatePosition(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].asteroid_distance_modifier);
            // use this to change complexity of asteroids; higher values -> more triangles
            const minPointsBound = 9;
            const maxPointsBound = 15;
            // todo new logic enviro var
            const maxPoints = Math.floor(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroids, minPointsBound, maxPointsBound));
            //             let newShape = new RandomShapeClass(material, box_rad, pos, maxPoints)
            let newShape = new _classes_random_shape_class_model__WEBPACK_IMPORTED_MODULE_1__["RandomShapeClass"](material, box_rad, pos, maxPoints, boxHelpers);
            // todo shapesArray will be gotten rid of
            shapesArray.push(newShape);
            // todo we want to add to group not scene
            scene.add(newShape.shapeObj);
            if (boxHelpers == true) {
                scene.add(newShape.boxHelper);
            }
            // todo why adding to scene before checking conflicts
            let conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene, boxHelpers);
            // if conflict found in initial placing of asteroid, loop through all asteroids
            // to find a new position free of collisions
            while (conflictCheck == true) {
                // each time, increase radius before generating position to reduce conflict likelihood
                // todo new logic use environment var
                let new_diam = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].max_asteroid_radius * 1.1;
                let new_pos = this.generatePosition(new_diam);
                // todo translate geometry: could be helper function inside shape taking pos as input
                // todo here same as constructor, edit
                let posVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](newShape.position[0], newShape.position[1], newShape.position[2]);
                let posLength = posVec.length();
                newShape.shapeObj.translateOnAxis(posVec.normalize(), posLength);
                let newVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](new_pos[0], new_pos[1], new_pos[2]);
                let newLength = newVec.length();
                newShape.shapeObj.translateOnAxis(newVec.normalize(), newLength);
                scene.remove(newShape.boxHelper);
                newShape.changeBoxHelperCol(false);
                if (boxHelpers == true) {
                    scene.add(newShape.boxHelper);
                }
                newShape.initDirectionTheta();
                conflictCheck = this.checkConflicts(newShape, shapesArray, i, scene, boxHelpers);
            }
            // todo change this with directionBool
            if (directionHelpers) {
                scene.add(newShape.initRotationHelper());
                scene.add(newShape.initDirectionHelper());
            }
        }
    }
    generatePosition(max_radius) {
        // todo make this based on distance to camera not size of radius
        let min_bound = max_radius * 17;
        let horzAngle = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(Math.random() * 360.0);
        // new: constrain vertical angle to make an asteroid "belt" effect
        let vertAngle = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].degToRad(Math.random() * 30);
        min_bound = min_bound * .9 + Math.random() * (min_bound * .1);
        let horz_min_bound = min_bound * Math.cos(vertAngle);
        let ranVec = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](horz_min_bound * Math.cos(horzAngle), min_bound * Math.sin(vertAngle), horz_min_bound * Math.sin(horzAngle));
        let pos = [ranVec.x, ranVec.y, ranVec.z];
        return pos;
    }
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection/Bounding_volume_collision_detection_with_THREE.js
    // todo move into asteroid class? or other helper class?
    checkConflicts(asteroid, shapesArray, index, scene, boxHelpers) {
        let checkBool = false;
        for (let j = 0; j < index; j++) {
            let other = shapesArray[j];
            let thisBool = asteroid.checkOtherConflict(other);
            if (thisBool) {
                asteroid.conflictHit = true;
                other.conflictHit = true;
                checkBool = true;
                if (boxHelpers == true) {
                    scene.remove(asteroid.boxHelper);
                    asteroid.changeBoxHelperCol(true);
                    scene.add(asteroid.boxHelper);
                    scene.remove(other.boxHelper);
                    other.changeBoxHelperCol(true);
                    scene.add(other.boxHelper);
                }
            }
        }
        if (checkBool == false) {
            //             let tempGoodAstBool = asteroid.conflictHit
            asteroid.conflictHit = false;
            if (boxHelpers) {
                scene.remove(asteroid.boxHelper);
                asteroid.changeBoxHelperCol(false);
                scene.add(asteroid.boxHelper);
            }
        }
        return checkBool;
    }
    // todo new logic here check collisions
    checkLaserCollisions(shapesArray, scene, boxHelpers) {
        // todo new logic use environment file
        //         let laserGroup = scene.getObjectByName("laserGroup")
        // todo new logic only hit this in start or mode name 2
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode == "") {
            let laserGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].laserGroupName);
            if (laserGroup != undefined) {
                // todo new logic button hits
                let buttonGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupName);
                laserGroup.children.forEach((laser, index) => {
                    if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart == true) {
                        for (let i = 0; i < shapesArray.length; i++) {
                            // @ts-ignore
                            if (laser.geometry.boundingSphere != undefined) {
                                let hitCheck = shapesArray[i].checkPointConflict(laser.position);
                                if (hitCheck == true) {
                                    // new logic: break asteroid into smaller chunks
                                    this.blowUpAsteroid(shapesArray, i, scene, boxHelpers);
                                    // delete asteroid removes from scene
                                    shapesArray[i].deleteAsteroid();
                                    // todo splice necessary here because splicing array, not children object
                                    shapesArray.splice(i, 1);
                                    i -= 1;
                                    // new logic delete using laser function and splice group
                                    laser.userData.deleteLaser();
                                    // todo new logic: no splice, avoid error deleting all lasers on hit, remove parent delete
                                }
                            }
                        }
                    }
                    //                     if(buttonGroup != undefined && environment.postGameMode == ""){
                    if (buttonGroup != undefined) {
                        buttonGroup.children.forEach((child, i) => {
                            if (child.userData.checkPointConflict != undefined) {
                                let retConf = child.userData.checkPointConflict(laser.position);
                                if (retConf == true) {
                                    // todo use env var not "START" hardcode
                                    if (child.userData.message == _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].startString) {
                                        _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].gameStart = true;
                                        child.userData.deleteText();
                                        // @ts-ignore
                                        //                                             buttonGroup.children.splice(0, i)
                                        laser.userData.deleteLaser();
                                        // todo new logic: no splice, avoid error deleting all lasers on hit
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    checkLaserKeyboardCollisions(scene) {
        let laserGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].laserGroupName);
        let buttonGroup = scene.getObjectByName(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].buttonGroupName);
        if (laserGroup != undefined) {
            laserGroup.children.forEach((laser, index) => {
                if (buttonGroup != undefined) {
                    buttonGroup.children.forEach((child, i) => {
                        if (child.userData.checkPointConflict != undefined) {
                            let retConf = child.userData.checkPointConflict(laser.position);
                            if (retConf == true) {
                                // todo new logic test for "ENTER message"
                                if (child.userData.message == _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].enterString) {
                                    // after enter hit hit new environment
                                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].modeName4;
                                    return;
                                }
                                else if (child.userData.message == _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].playAgainString) {
                                    // refresh page
                                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].scoreboardObject[0] = 3;
                                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].postGameMode = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].modeName4;
                                    return;
                                }
                                else if (child.userData.message == _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].deleteString) {
                                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry.slice(0, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry.length - 1);
                                    return;
                                }
                                // logic if length current name over max then splice first char off
                                if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry.length >= _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].maxEntryLength) {
                                    _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry.slice(1, _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry.length - 1);
                                }
                                _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].currWordEntry += child.userData.message;
                            }
                        }
                    });
                }
            });
        }
    }
    blowUpAsteroid(shapesArray, index, scene, boxHelpers) {
        // get asteroid from array
        let asteroid = shapesArray[index];
        // todo new logic increment user score
        _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].userScore += parseInt(asteroid.shapeObj.userData.points);
        // set min and max number of asteroids generated by explosion
        let min_new_asteroids = 3;
        let max_new_asteroids = 5;
        let num_new_asteroids = Math.floor(three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, min_new_asteroids, max_new_asteroids));
        // loop through and create number of asteroids between min and max
        for (let i = 0; i < num_new_asteroids; i++) {
            // get old color, going to decrease red green and blue to make darker (because smaller)
            let old_color = asteroid.material.color;
            // generate color using old values and decreasing
            let new_color = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, old_color.r * .95, old_color.r), three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, old_color.g * 1.25, old_color.g), three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, old_color.b * 1.4, old_color.b));
            // generate material for new asteroid
            let material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshPhongMaterial"]({
                color: new_color,
                side: three__WEBPACK_IMPORTED_MODULE_0__["FrontSide"]
            });
            // create asteroid with smaller radius than previous, between .45 and .75 previous
            // todo use min here to avoid Nan scores
            let box_rad = three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(i, 0, num_new_asteroids - 1, asteroid.radius * .20, asteroid.radius * .40);
            // todo new logic use environment asteroid size
            if (box_rad >= _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].min_asteroid_radius) {
                // create new asteroid object
                //                 let new_asteroid_gen = new RandomShapeClass(material, box_rad, asteroid.position, asteroid.maxPoints-1)
                // todo new logic boxHelpersBool for now pass false
                let new_asteroid_gen = new _classes_random_shape_class_model__WEBPACK_IMPORTED_MODULE_1__["RandomShapeClass"](material, box_rad, asteroid.position, asteroid.maxPoints - 1, boxHelpers);
                // copy information on direction, current angle etc to line up with old position
                new_asteroid_gen.thetaNow = asteroid.thetaNow;
                new_asteroid_gen.direction = asteroid.getDirection();
                // create a new push direction with random values but based on old
                new_asteroid_gen.setPushDir([
                    three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, -20, 30 + asteroid.pushDir.x),
                    three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, -1, 1 + asteroid.pushDir.y),
                    three__WEBPACK_IMPORTED_MODULE_0__["MathUtils"].mapLinear(Math.random(), 0, 1, -20, 30 + asteroid.pushDir.z),
                ]);
                // copy old position but also change position slightly to reduce overlap
                new_asteroid_gen.shapeObj.position.copy(asteroid.shapeObj.position);
                new_asteroid_gen.shapeObj.position.x += Math.random() * asteroid.radius;
                new_asteroid_gen.shapeObj.position.y += Math.random() * asteroid.radius;
                new_asteroid_gen.shapeObj.position.z += Math.random() * asteroid.radius;
                scene.add(new_asteroid_gen.shapeObj);
                shapesArray.push(new_asteroid_gen);
            }
        }
    }
}
ObjBuilderService.ɵfac = function ObjBuilderService_Factory(t) { return new (t || ObjBuilderService)(); };
ObjBuilderService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: ObjBuilderService, factory: ObjBuilderService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map