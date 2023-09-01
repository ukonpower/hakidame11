import * as GLP from 'glpower';
import { Pole } from '../Pole';
import { Wire } from '../Wire';
import { Modeler } from '~/ts/libs/Modeler';
import { power } from '~/ts/Globals';

import basicVert from '~/shaders/basic.vs';
import basicFrag from '~/shaders/basic.fs';

export class Poles extends GLP.Entity {

	constructor() {

		super();

		const num = 16;

		let prev: Pole | null = null;

		const wiresModel = new GLP.Entity();

		for ( let i = 0; i < num; i ++ ) {

			const pole = new Pole();

			const x = ( Math.random() - 0.5 ) * 15.0;
			const z = ( Math.random() - 0.5 ) * 15.0;

			pole.scale.multiply( Math.random() * 0.5 + 0.5 );
			pole.position.set( x, 0, z );
			pole.quaternion.setFromEuler( new GLP.Euler( 0, Math.random() * Math.PI, 0 ) );

			this.add( pole );

			if ( prev ) {

				pole.gaishi.forEach( ( c, i ) => {

					const wire = new Wire();
					wiresModel.add( wire );
					if ( prev ) {

						wire.entityToEntity( prev.gaishi[ i ], c );

					}

				} );

			}

			prev = pole;

		}

		const wires = new GLP.Entity();
		wires.addComponent( "geometry", new Modeler( power ).bakeEntity( wiresModel ) );
		wires.addComponent( "material", new GLP.Material( {
			name: "wires",
			vert: basicVert,
			frag: basicFrag,
			type: [ "deferred", "shadowMap" ]
		} ) );
		this.add( wires );

		console.log( new Modeler( power ).bakeEntity( wiresModel ) );


	}

}
