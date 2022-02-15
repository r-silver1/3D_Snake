/*
* ADAPTION THREEJS FIRST PERSON CONTROLS
*/

import {
	MathUtils,
	Spherical,
	Vector3
} from 'three';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

class TurretControls {

	constructor( object, domElement ) {

		if ( domElement === undefined ) {

			console.warn( 'THREE.TurretControls: The second parameter "domElement" is now mandatory.' );
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
		this.targetCopy = new Vector3()
		this.preAddCopy = new Vector3()

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

			if ( this.domElement === document ) {

				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;

			} else {

				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;

			}

		};


		this.onMouseMove = function ( event ) {

			if ( this.domElement === document ) {

				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;

			} else {

				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

			}

		};

		this.onMouseLeave = function ( event ) {
		    // todo need to see usage of this, likely unneeded else if
		    if ( this.domElement === document) {
		        this.enabled = false
		    }else{
		        this.enabled = false

		    }
		}

		this.onMouseEnter = function( event ) {
		    if ( this.domElement === document ) {
		        this.enabled = true
		    }else{
		        this.enabled = true
		    }

		}


		this.lookAt = function ( x, y, z ) {

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			this.object.lookAt( _target );

			setOrientation( this );

			return this;

		};

		this.update = function () {

			const targetPosition = new Vector3();

			return function update( delta ) {

				if ( this.enabled === false ) return;

				if ( this.heightSpeed ) {

					const y = MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
					const heightDelta = y - this.heightMin;

					this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

				} else {

					this.autoSpeedFactor = 0.0;

				}


				let actualLookSpeed = delta * this.lookSpeed;

				if ( ! this.activeLook ) {

					actualLookSpeed = 0;

				}

				let verticalLookRatio = 1;

				if ( this.constrainVertical ) {

					verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

				}
                // todo here new change with ratio for lon added
                lon -= this.mouseX * actualLookSpeed;
//				lon -= this.mouseX * actualLookSpeed * verticalLookRatio;
				if ( this.lookVertical ) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

                // todo here should make new variables for max movement any dir
				lat = Math.max( - 35, Math.min( 25, lat ) );

				let phi = MathUtils.degToRad( 90 - lat );

                // todo new lon logic... angle from z+ axis?
				lon = Math.max(130, Math.min(235, lon))
				const theta = MathUtils.degToRad( lon );

                // todo here: removed logic for this constrain vertical; maybe just make look ratio own variable?
//				if ( this.constrainVertical ) {
////					phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
//				}

				const position = this.object.position;
				// todo here preAddCopy only used helper
				if(this.CameraHelpers == true){
                    this.preAddCopy.setFromSphericalCoords( 1, phi, theta )
                }
				targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

				this.object.lookAt( targetPosition );
//				// todo here targetCopy only used helper
                if(this.CameraHelpers == true){
				    this.targetCopy.copy(targetPosition)
				}


			};

		}();

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'mousemove', _onMouseMove );
            this.domElement.removeEventListener( 'mouseleave',  _onMouseLeave)
            this.domElement.removeEventListener( 'mouseenter', _onMouseEnter )

		};

		const _onMouseMove = this.onMouseMove.bind( this );
		const _onMouseLeave = this.onMouseLeave.bind( this );
		const _onMouseEnter = this.onMouseEnter.bind( this );


		this.domElement.addEventListener( 'contextmenu', contextmenu );
		this.domElement.addEventListener( 'mousemove', _onMouseMove );
		this.domElement.addEventListener( 'mouseleave', _onMouseLeave )
		this.domElement.addEventListener( 'mouseenter', _onMouseEnter )


		function setOrientation( controls ) {

			const quaternion = controls.object.quaternion;

			_lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
			_spherical.setFromVector3( _lookDirection );

			lat = 90 - MathUtils.radToDeg( _spherical.phi );
			lon = MathUtils.radToDeg( _spherical.theta );

		}

		this.handleResize();

		setOrientation( this );

	}

}

function contextmenu( event ) {

	event.preventDefault();

}

export { TurretControls };
