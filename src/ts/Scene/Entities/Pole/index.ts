import * as GLP from 'glpower';

import poleFrag from './shaders/pole.fs';
import poleVert from './shaders/pole.vs';
import { globalUniforms, power } from '~/ts/Globals';
import { hotGet } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { Modeler } from '~/ts/libs/Modeler';

export class Pole extends GLP.Entity {

	public nextPole: Pole | null;
	public gaishi: GLP.Entity[];

	constructor() {

		super();

		const height = 10;
		const radius = 0.3;

		this.nextPole = null;

		this.gaishi = [];

		// model

		const model = new GLP.Entity();
		const modeler = new Modeler( power );

		// pole

		const pole = new GLP.Entity();
		pole.addComponent( "geometry", new GLP.CylinderGeometry( radius, radius - 0.1, height ) );
		pole.position.y += height / 2;
		model.add( pole );

		// ashiba

		const ashiba = new GLP.Entity();
		const ashibaGeo = new GLP.CylinderGeometry( 0.03, 0.03, 0.4 );
		ashibaGeo.setAttribute( 'oPos', new Float32Array( ( ()=>{

			const r: number[] = [];
			for ( let i = 0; i < 8; i ++ ) {

				for ( let j = 0; j < 2; j ++ ) {

					r.push( 0.0, ( i + j * 0.5 ) * 0.8, ( j - 0.5 ) * 0.6 );

				}

			}

			return r;

		} )() ), 3, { instanceDivisor: 1 } );
		ashiba.addComponent( "geometry", ashibaGeo );
		ashiba.addComponent( "material", new GLP.Material( {
			vert: poleVert,
			defines: { 'ASHIBA': '' }
		} ) );
		ashiba.position.set( 0.0, 2.5, 0.0 );
		model.add( ashiba );

		// sasae

		const sasae = new GLP.Entity();
		sasae.addComponent( "geometry", new GLP.CubeGeometry( 2.5, 0.2, 0.15 ) );
		sasae.position.set( 0.3, height * 0.85, 0.3 );
		sasae.quaternion.setFromEuler( new GLP.Euler( 0, Math.PI / 2, 0 ) );
		model.add( sasae );

		// gaishi

		for ( let i = 0; i < 3; i ++ ) {

			const gaishi = new GLP.Entity();
			gaishi.addComponent( "geometry", new GLP.CylinderGeometry( 0.09, 0.09, 0.24 ) );
			gaishi.position.set( ( i / 2 - 0.5 ) * 2, 0.25, 0.0 );
			sasae.add( gaishi );

			gaishi.updateMatrix( true );

			const gaishiDummy = new GLP.Entity();
			gaishiDummy.applyMatrix( gaishi.matrixWorld );
			this.add( gaishiDummy );
			this.gaishi.push( gaishiDummy );

		}

		// henatsu

		if ( Math.random() < 0.8 ) {

			const henatsu = new GLP.Entity();
			henatsu.addComponent( "geometry", new GLP.CylinderGeometry( 0.4, 0.4, 1.0 ) );
			henatsu.position.set( 0.3, height * 0.7, 0.3 );
			henatsu.quaternion.setFromEuler( new GLP.Euler( 0, Math.PI / 2, 0 ) );
			model.add( henatsu );

		}

		// kanagu

		for ( let i = 0; i < 5; i ++ ) {

			const w = i / 5;
			const r = ( radius + 0.02 ) - 0.1 * w;
			const kanagu = new GLP.Entity();
			kanagu.addComponent( "geometry", new GLP.CylinderGeometry( r, r, 0.2 ) );
			kanagu.position.set( 0.0, height * ( 0.2 + w * 0.6 + Math.random() * 0.2 ), 0.0 );
			model.add( kanagu );

		}

		// modeling

		this.addComponent( "geometry", modeler.bakeEntity( model ) );
		this.addComponent( "material", new GLP.Material( {
			name: "pole",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			frag: hotGet( 'poleFrag', poleFrag ),
			vert: hotGet( 'poleVert', poleVert ),
		} ) );

	}

}
