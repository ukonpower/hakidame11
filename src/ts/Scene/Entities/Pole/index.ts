import * as GLP from 'glpower';

import poleFrag from './shaders/pole.fs';
import poleVert from './shaders/pole.vs';

import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Pole extends GLP.Entity {

	constructor() {

		super();

		const height = 11;

		const matParam: GLP.MaterialParam = {
			name: "pole",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			frag: hotGet( 'poleFrag', poleFrag ),
			vert: hotGet( 'poleVert', poleVert )
		};

		const mat = this.addComponent( "material", new GLP.Material( matParam ) );

		// pole

		const pole = new GLP.Entity();
		pole.addComponent( "geometry", new GLP.CylinderGeometry( 0.30, 0.20, height ) );
		pole.addComponent( "material", mat );
		pole.position.y += height / 2;
		this.add( pole );

		// ashiba

		const ashiba = new GLP.Entity();
		const ashibaGeo = ashiba.addComponent( "geometry", new GLP.CylinderGeometry( 0.03, 0.03, 0.4 ) );
		ashibaGeo.setAttribute( 'oPos', new Float32Array( ( ()=>{

			const r: number[] = [];
			for ( let i = 0; i < 8; i ++ ) {

				for ( let j = 0; j < 2; j ++ ) {

					r.push( ( j - 0.5 ) * 0.6, ( i + j * 0.5 ) * 0.8, 0 );

				}

			}

			return r;

		} )() ), 3, { instanceDivisor: 1 } );
		ashiba.addComponent( "material", new GLP.Material( { ...matParam, defines: { 'ASHIBA': '' } } ) );
		ashiba.position.set( 0.0, 2.5, 0.0 );
		this.add( ashiba );

		// sasae

		const sasae = new GLP.Entity();
		sasae.addComponent( "geometry", new GLP.CubeGeometry( 2.5, 0.2, 0.15 ) );
		sasae.addComponent( "material", mat );
		sasae.position.set( 0.3, height * 0.85, 0.3 );
		this.add( sasae );

		// gaishi

		for ( let i = 0; i < 3; i ++ ) {

			const gaishi = new GLP.Entity();
			gaishi.addComponent( "geometry", new GLP.CylinderGeometry( 0.09, 0.09, 0.24 ) );
			gaishi.addComponent( "material", mat );
			gaishi.position.set( ( i / 2 - 0.5 ) * 2, 0.25, 0.0 );

			sasae.add( gaishi );

		}

	}

}
