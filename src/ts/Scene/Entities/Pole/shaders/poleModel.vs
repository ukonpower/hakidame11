#include <common>
#include <vert_h>
#include <rotate>

out vec3 o_position;
out vec3 o_normal;


#ifdef ASHIBA

	layout ( location = 3 ) in vec3 oPos;

#endif

void main( void ) {

	#include <vert_in>
	
	#ifdef ASHIBA

		outPos.xy *= rotate( HPI );
		outPos += oPos;
	
	#endif

	o_position = outPos;
	o_normal = outNormal;
	
}