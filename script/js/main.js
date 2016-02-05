/*RequireJs Module, to start webGlStart function thoses js files are required */


require([
				'JsFilesloaded',
				'gltp1_fichiers/webgl-utils.js',
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
				'atomicGL2Context.js',
				'atomicGLWalkCamera.js',
				'atomicGLObject3d.js',
				'atomicGL2MatrixStack.js',
				'atomicGL2SceneGraph.2.js',
				'atomicGL2Texture.js',
				'atomicGL2Clock.js',
				'atomicGL2Shader.2.js',
				'atomicGLSkyBox.js',
				'atomicGL2xml.2.js',
				'script/js/webGLStart.js',
				'lights/atomicGL2Light.js',
				'lights/atomicGL2PointLight.js',
				'lights/atomicGL2DirectionnalLight.js',
				'lights/atomicGL2SpotLight.js',
				'atomicGL2Mesh.js'
		],function(JsFilesloaded){
			JsFilesloaded.webGLStart();
});
