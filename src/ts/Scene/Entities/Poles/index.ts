import * as GLP from 'glpower';
import { Pole } from '../Pole';
import { Modeler } from '~/ts/libs/Modeler';
import { power } from '~/ts/Globals';

import basicVert from '~/shaders/basic.vs';
import basicFrag from '~/shaders/basic.fs';

export class Poles extends GLP.Entity {

	constructor() {

		super();

		const num = 16;

		let prev: Pole | null = null;

		const model = new GLP.Entity();

		for ( let i = 0; i < num; i ++ ) {

			const pole = new Pole();

			// pole.position.x += ( i - ( num - 1 ) / 2 ) * 4.0;
			const x = ( Math.random() - 0.5 ) * 15.0;
			const z = ( Math.random() - 0.5 ) * 15.0;

			pole.scale.multiply( Math.random() * 0.5 + 0.5 );
			pole.position.set( x, 0, z );
			pole.quaternion.setFromEuler( new GLP.Euler( 0, Math.random() * Math.PI, 0 ) );

			this.add( pole );

			if ( prev ) {

				prev.setNextPole( pole );

			}

			prev = pole;

		}

		// this.addComponent( 'geometry', new Modeler( power ).bakeEntity( model ) );
		// this.addComponent( 'material', new GLP.Material( {
		// 	vert: basicVert,
		// 	frag: basicFrag,
		// 	type: [ "deferred", "shadowMap" ]
		// } ) );

	}

}
