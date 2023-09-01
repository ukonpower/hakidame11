import * as GLP from 'glpower';
import { power } from '~/ts/Globals';
import { Modeler } from '~/ts/libs/Modeler';

import basicVert from '~/shaders/basic.vs';
import basicFrag from '~/shaders/basic.fs';

export class Tomare extends GLP.Entity {

	constructor() {

		super();

		const model = new GLP.Entity();
		const modeler = new Modeler( power );

		const height = 2.0;

		const mat = new GLP.Material( {
			name: "wires",
			vert: basicVert,
			frag: basicFrag,
			type: [ "deferred", "shadowMap" ]
		} );

		// pole

		const pole = new GLP.Entity();
		pole.addComponent( "geometry", new GLP.CylinderGeometry( 0.05, 0.05, height ) );
		pole.position.y += height / 2;
		model.add( pole );

		// board

		const board = new GLP.Entity();
		board.addComponent( "geometry", new GLP.CylinderGeometry( 0.30, 0.30, 0.02, 32 ) );
		board.quaternion.multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( Math.PI / 2, 0.0, 0.0 ) ) );
		board.position.y += height;
		board.position.z += 0.05;
		model.add( board );

		// board

		const rectBoard = new GLP.Entity();
		rectBoard.addComponent( "geometry", new GLP.CubeGeometry( 0.5, 0.2, 0.01 ) );
		rectBoard.position.y += height - 0.45;
		rectBoard.position.z += 0.05;
		model.add( rectBoard );

		// modeling

		this.addComponent( "geometry", modeler.bakeEntity( model ) );
		this.addComponent( "material", mat );

	}

}
