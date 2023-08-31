import * as GLP from 'glpower';

import poleVert from './shaders/pole.vs';
import poleFrag from '~/shaders/basic.fs';
import { gl } from '~/ts/Globals';

export class PoleWire extends GLP.Entity {

	public start: GLP.Vector;
	public end: GLP.Vector;
	private uniforms: GLP.Uniforms;

	constructor() {

		super();

		this.start = new GLP.Vector();
		this.end = new GLP.Vector();

		this.uniforms = {
			uPosStart: {
				value: new GLP.Vector(),
				type: "3f"
			},
			uPosEnd: {
				value: new GLP.Vector(),
				type: "3f"
			}
		};

		this.addComponent( 'geometry', new GLP.CylinderGeometry( 0.03, 0.03, 1, 8, 10, false ) );
		this.addComponent( 'material', new GLP.Material( {
			vert: poleVert,
			frag: poleFrag,
			uniforms: this.uniforms,
			type: [ "deferred", "shadowMap" ],
		} ) );

	}

	public setPoints( start: GLP.Vector, end: GLP.Vector ) {

		this.start.copy( start );
		this.end.copy( end );

		this.uniforms.uPosStart.value.copy( this.start );
		this.uniforms.uPosEnd.value.copy( this.end );

	}

}
