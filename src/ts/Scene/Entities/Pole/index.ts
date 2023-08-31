import * as GLP from 'glpower';

import poleFrag from './shaders/pole.fs';
import poleVert from './shaders/pole.vs';

import { globalUniforms } from '~/ts/Globals';
import { hotGet } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { PoleWire } from '../PoleWire';

export class Pole extends GLP.Entity {

	public nextPole: Pole | null;

	public gaishi: GLP.Entity[];
	public wires: PoleWire[];

	constructor() {

		super();

		const height = 11;
		this.nextPole = null;
		this.gaishi = [];
		this.wires = [];

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
		sasae.quaternion.setFromEuler( new GLP.Euler( 0, Math.PI / 2, 0 ) );
		this.add( sasae );

		// gaishi

		for ( let i = 0; i < 3; i ++ ) {

			const gaishi = new GLP.Entity();
			gaishi.addComponent( "geometry", new GLP.CylinderGeometry( 0.09, 0.09, 0.24 ) );
			gaishi.addComponent( "material", mat );
			gaishi.position.set( ( i / 2 - 0.5 ) * 2, 0.25, 0.0 );
			sasae.add( gaishi );
			this.gaishi.push( gaishi );

			const wire = new PoleWire();
			sasae.add( wire );
			this.wires.push( wire );

		}

		// henatsu

		const henatsu = new GLP.Entity();
		henatsu.addComponent( "geometry", new GLP.CylinderGeometry( 0.4, 0.4, 1.0 ) );
		henatsu.addComponent( "material", new GLP.Material( { ...matParam, defines: { 'HENNATSU': '' } } ) );
		henatsu.position.set( 0.3, height * 0.7, 0.3 );
		henatsu.quaternion.setFromEuler( new GLP.Euler( 0, Math.PI / 2, 0 ) );
		this.add( henatsu );

		for ( let i = 0; i < 3; i ++ ) {

			const wire = new PoleWire();
			henatsu.add( wire );
			wire.entityToEntity( wire, this.gaishi[ i ] );

		}

	}

	public setNextPole( pole: Pole ) {

		this.nextPole = pole;

		this.calcPoleWire();

	}

	public calcPoleWire() {

		if ( ! this.nextPole ) return;

		this.wires.forEach( ( wire, i ) => {

			if ( ! this.nextPole ) return;

			const start = this.gaishi[ i ].position.clone();
			const end = this.nextPole.gaishi[ i ].position.clone();

			const gaishiSasae = this.gaishi[ i ].parent!;
			gaishiSasae.updateMatrix( true );

			const nextGaishiSasae = this.nextPole.gaishi[ i ].parent!;
			nextGaishiSasae.updateMatrix( true );

			end.applyMatrix4( nextGaishiSasae.matrixWorld );
			end.applyMatrix4( gaishiSasae.matrixWorld.clone().inverse() );

			wire.setPoints( start, end );

		} );

	}

}
