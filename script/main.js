/*RequireJs Module, to start webGlStart function thoses js files are required */


require([
				'script/JsFilesloaded.js',
				'script/shaders/atomicGL2Shader.js',

				'script/includes/webgl-utils.js',
				'script/includes/glMatrix-0.js',
				
				'objs/palais_v01_bois_parquet.js',
				'objs/palais_v01_bois_poutre.js',
				'objs/palais_v01_decors.js',
				'objs/palais_v01_mur.js',
				'objs/palais_v01_terrase.js',
				'objs/palais_v01_toiture.js',
				'objs/pont_dessus.js',
				'objs/pont_pierre.js',
				'objs/riviere.js',
				'objs/sol.js',
				'objs/sol_herbe.js',
				'objs/sol_muret.js',
				'objs/sol_route.js',
				'objs/sol_sable.js',
				'objs/tour1base.js',
				'objs/tour1mur.js',
				'objs/tour1parape.js',
				'objs/tour1sol.js',
				'objs/donjonBase.js',
				'objs/donjonBois.js',
				'objs/donjonFenetre.js',
				'objs/donjonMur.js',
				'objs/donjonSol.js',
				'objs/donjonToiture.js',
				'objs/maison1mur.js',
				'objs/maison1sol.js',
				'objs/maison1stone.js',
				'objs/maison1stone2.js',
				'objs/maison1toit.js',
				'objs/maison1wood.js',
				'objs/maison3.js',
				'objs/maison3roof.js',
				'objs/maison3wood.js',
				'objs/mur2base.js',
				'objs/mur2bois.js',
				'objs/mur2pierre.js',
				'objs/mur2toit.js',
				'objs/tour1toit.js',

				'script/lights/atomicGL2Light.js',
				'script/lights/atomicGL2PointLight.js',
				'script/lights/atomicGL2DirectionnalLight.js',
				'script/lights/atomicGL2SpotLight.js',
				
				'script/loaders/atomicGL2ShaderLoader.js',
				'script/loaders/atomicGL2ShaderLoaderScriptXML.js',
				'script/loaders/atomicGL2ShaderLoaderScriptInLine.js',

				'script/objects3D/atomicGL2ObjMesh.js',
				'script/objects3D/atomicGL2Cube.js',
				'script/objects3D/atomicGL2Cylinder.js',
				'script/objects3D/atomicGL2Sphere.js',
				'script/objects3D/atomicGLxyPlane.js',

				'script/shaders/atomicGL2Texture.js',
				'script/shaders/atomicGLSkyBox.js',

				'script/webgl/atomicGL2Clock.js',
				'script/webgl/atomicGL2Context.js',
				'script/webgl/atomicGL2Importer.js',
				'script/webgl/atomicGL2MatrixStack.js',
				'script/webgl/atomicGL2SceneGraph.2.js',
				'script/webgl/atomicGL2xml.2.js',
				'script/webgl/atomicGLWalkCamera.js',
				
				'script/webGLStart.js'
				
		],function(JsFilesloaded){
			JsFilesloaded.webGLStart();
});