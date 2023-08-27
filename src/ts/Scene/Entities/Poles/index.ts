import * as GLP from 'glpower';
import { Pole } from '../Pole';

export class Poles extends GLP.Entity {

	constructor() {

		super();

		for ( let i = 0; i < 4; i ++ ) {

			const pole = new Pole();

			this.add( pole );

		}

	}

}
