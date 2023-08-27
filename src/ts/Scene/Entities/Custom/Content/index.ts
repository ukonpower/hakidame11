import * as GLP from 'glpower';

import contentFrag from './shaders/content.fs';
import contentEmitFrag from './shaders/contentEmit.fs';
import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { TurnTable } from '~/ts/Scene/Components/TurnTable';

export class Content extends GLP.Entity {

	private rnd: number;

	private euler: GLP.Euler;
	private rot: GLP.Quaternion;

	constructor() {

		super();

		this.rnd = Math.random() * 10.0;

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "content",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, globalUniforms.resolution ),
			frag: hotGet( 'contentFrag', contentFrag )
		} ) );


		this.euler = new GLP.Euler();
		this.rot = new GLP.Quaternion();

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/content.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'content', module.default );
					mat.requestUpdate();

				}

			} );

		}

		const num = 5;

		for ( let i = 0; i < num; i ++ ) {

			const n = i / num;

			const c = new GLP.Entity();
			c.addComponent( "geometry", new GLP.CubeGeometry() );
			c.addComponent( "material", this.getComponent( 'material' )! );

			c.position.x = Math.sin( n * Math.PI * 2.0 ) * 2.0;
			c.position.z = Math.cos( n * Math.PI * 2.0 ) * 2.0;
			c.scale.multiply( 0.2 );
			this.add( c );

			const numnum = 3;

			for ( let j = 0; j < numnum; j ++ ) {

				const nn = j / numnum;

				const cc = new GLP.Entity();
				cc.addComponent( "geometry", new GLP.CubeGeometry() );
				cc.addComponent( "material", new GLP.Material( {
					name: "content",
					type: [ "deferred", "shadowMap" ],
					uniforms: GLP.UniformsUtils.merge( globalUniforms.time, globalUniforms.resolution ),
					frag: contentFrag
				} ) );

				cc.position.x = Math.sin( nn * Math.PI * 2.0 ) * 2.4;
				cc.position.z = Math.cos( nn * Math.PI * 2.0 ) * 2.4;
				cc.scale.multiply( 0.5 );
				c.add( cc );

			}

		}

	}

	protected updateImpl( event: GLP.EntityUpdateEvent ): void {

		this.rot.setFromEuler( this.euler.set( 0, ( Math.sin( event.time ) * 0.5 + 0.5 ) * event.deltaTime * 9.5, 0.0 ) );
		this.quaternion.multiply( this.rot );

		for ( let i = 0; i < this.children.length; i ++ ) {

			const c = this.children[ i ];

			this.rot.setFromEuler( this.euler.set( event.deltaTime, ( Math.sin( event.time - ( i / this.children.length ) * Math.PI * 2.0 ) * 0.5 + 0.5 ) * event.deltaTime * 9.0, event.deltaTime ) );
			c.quaternion.multiply( this.rot );

		}

	}

}
