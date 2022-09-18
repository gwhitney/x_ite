const X_ITE_TESTS = [
   { component: "CADGeometry" },
   { path: "CADGeometry/CADGeometry.x3d" },
   { path: "CADGeometry/CADLayer.x3d" },
   { path: "CADGeometry/IndexedQuadSetBox.x3d" },
   { path: "CADGeometry/IndexedQuadSetSphere.x3d" },
   { path: "CADGeometry/setco.x3dz" },
   { component: "ComposedCubeMapTexture" },
   { path: "ComposedCubeMapTexture/ComposedCubeMapMovieTexture.x3d" },
   { path: "ComposedCubeMapTexture/ComposedCubeMapTexture.x3d" },
   { path: "ComposedCubeMapTexture/GeneratedCubeMapTexture.x3d" },
   { path: "ComposedCubeMapTexture/ImageCubeMapTexture.x3d" },
   { component: "Core" },
   { path: "Core/Comment.x3d" },
   { path: "Core/DataURL.x3d" },
   { path: "Core/EXPORT.wrl" },
   { path: "Core/EXPORT.x3d" },
   { path: "Core/EXPORT.x3dv" },
   { path: "Core/IMPORT.x3d" },
   { path: "Core/IMPORT.x3dv" },
   { path: "Core/Statements.x3d" },
   { path: "Core/export.x3d" },
   { path: "Core/proto" },
   { path: "Core/units.x3d" },
   { path: "Core/units.x3dv" },
   { component: "EnvironmentalEffects" },
   { path: "EnvironmentalEffects/FogCoordinate.x3d" },
   { path: "EnvironmentalEffects/FogScale.x3d" },
   { path: "EnvironmentalEffects/ImageBackground.x3d" },
   { path: "EnvironmentalEffects/LocalFogScale.x3d" },
   { component: "EnvironmentalSensor" },
   { path: "EnvironmentalSensor/ProximitySensor.x3d" },
   { path: "EnvironmentalSensor/TransformSensor.x3d" },
   { path: "EnvironmentalSensor/VisibilitySensor.x3d" },
   { component: "EventUtilities" },
   { path: "EventUtilities/BooleanFilter.x3dv" },
   { path: "EventUtilities/BooleanToggle.x3dv" },
   { path: "EventUtilities/BooleanTrigger.x3dv" },
   { path: "EventUtilities/IntegerSequencer.x3dv" },
   { path: "EventUtilities/IntegerTrigger.x3dv" },
   { path: "EventUtilities/TimeTrigger.x3dv" },
   { component: "Follower" },
   { path: "Follower/ColorChaser.x3dv" },
   { path: "Follower/ColorDamper.x3dv" },
   { path: "Follower/CoordinateChaser.x3dv" },
   { path: "Follower/CoordinateDamper.x3dv" },
   { path: "Follower/LineTrail.x3dv" },
   { path: "Follower/MFVec2f.x3dv" },
   { path: "Follower/MFVec3f.x3dv" },
   { path: "Follower/OrientationChaser.x3dv" },
   { path: "Follower/OrientationDamper.x3dv" },
   { path: "Follower/PositionChaser.x3dv" },
   { path: "Follower/PositionChaser2D.x3dv" },
   { path: "Follower/PositionDamper.x3dv" },
   { path: "Follower/PositionDamper2D.x3dv" },
   { path: "Follower/SFFloat.x3dv" },
   { path: "Follower/SFVec2f.x3dv" },
   { path: "Follower/SFVec3f.x3dv" },
   { path: "Follower/ScalarChaser.x3d" },
   { path: "Follower/ScalarDamper.x3d" },
   { path: "Follower/TexCoordChaser2D.x3d" },
   { path: "Follower/TexCoordDamper.x3d" },
   { component: "Geometry2D" },
   { path: "Geometry2D/Geometry2D.x3d" },
   { component: "Geometry3D" },
   { path: "Geometry3D/1728.x3dv" },
   { path: "Geometry3D/Beethoven.x3dz" },
   { path: "Geometry3D/Cube.x3dv" },
   { path: "Geometry3D/Extrusion" },
   { path: "Geometry3D/Geometry3D.x3d" },
   { path: "Geometry3D/Smash.x3d" },
   { path: "Geometry3D/box.x3d" },
   { path: "Geometry3D/box.x3dv" },
   { path: "Geometry3D/dragon.x3d" },
   { component: "Geospatial" },
   { path: "Geospatial/GeoCoordinate.x3d" },
   { path: "Geospatial/GeoElevationGrid.UTM.x3d" },
   { path: "Geospatial/GeoElevationGrid.x3dz" },
   { path: "Geospatial/GeoLOD.x3d" },
   { path: "Geospatial/GeoLocation.x3dz" },
   { path: "Geospatial/GeoPositionInterpolator.x3d" },
   { path: "Geospatial/GeoProximitySensor.x3d" },
   { path: "Geospatial/GeoTouchSensor.x3dz" },
   { path: "Geospatial/GeoTransform.x3d" },
   { path: "Geospatial/GeoViewpoint.rotateYUp.x3dz" },
   { path: "Geospatial/GeoViewpoint.x3dz" },
   { path: "Geospatial/Geospatial.x3dz" },
   { path: "Geospatial/Globe.x3d" },
   { path: "Geospatial/YUp.x3d" },
   { path: "Geospatial/child1.x3dv" },
   { path: "Geospatial/child2.x3dv" },
   { path: "Geospatial/child3.x3dv" },
   { path: "Geospatial/child4.x3dv" },
   { path: "Geospatial/root.x3dv" },
   { path: "Geospatial/tie.x3dv" },
   { component: "Grouping" },
   { path: "Grouping/AddRemoveChildren.x3dv" },
   { path: "Grouping/StaticGroup.x3d" },
   { component: "HAnim" },
   { path: "HAnim/BoxManC.x3d" },
   { component: "Interpolation" },
   { path: "Interpolation/NormalInterpolator.x3d" },
   { path: "Interpolation/OrientationInterpolator.x3d" },
   { path: "Interpolation/PositionInterpolator.x3d" },
   { component: "Layering" },
   { path: "Layering/LayerSet.x3d" },
   { path: "Layering/Rotor.x3d" },
   { path: "Layering/Simple.x3d" },
   { path: "Layering/Viewport.x3d" },
   { path: "Layering/ViewportLayer.x3dv" },
   { component: "Layout" },
   { path: "Layout/ScreenFontStyle.x3dv" },
   { path: "Layout/ScreenGroup.x3d" },
   { path: "Layout/info.x3d" },
   { path: "Layout/library" },
   { component: "Lighting" },
   { path: "Lighting/LightScale.x3d" },
   { path: "Lighting/LocalLight.x3d" },
   { path: "Lighting/LocalLightScale.x3d" },
   { path: "Lighting/PointLight.x3d" },
   { path: "Lighting/PointLight.x3dv" },
   { path: "Lighting/PointLight2.x3d" },
   { path: "Lighting/SpotLight.x3d" },
   { component: "NURBS" },
   { path: "NURBS/AnimatedNurbsPatchSurfaceHead.x3dv" },
   { path: "NURBS/B.x3d" },
   { path: "NURBS/Circle.x3d" },
   { path: "NURBS/DefaultTextureCoordClosed.x3dv" },
   { path: "NURBS/FourDucks.x3dv" },
   { path: "NURBS/FredTheBunny.x3dv" },
   { path: "NURBS/HoleCentered.x3dv" },
   { path: "NURBS/HurricaneLantern.x3dv" },
   { path: "NURBS/MobiusNurbs.x3dv" },
   { path: "NURBS/NurbsCircle2D.x3dv" },
   { path: "NURBS/NurbsCurve.x3d" },
   { path: "NURBS/NurbsCurveExample.x3dv" },
   { path: "NURBS/NurbsPatch.x3dv" },
   { path: "NURBS/NurbsPatchImageTexture.x3dv" },
   { path: "NURBS/NurbsPatchSolid.x3dv" },
   { path: "NURBS/NurbsPatchSurfaceExample.x3dv" },
   { path: "NURBS/NurbsPatchSurfaceExampleLarge.x3dv" },
   { path: "NURBS/NurbsPatchSurfaceExampleWithOahuTexture.x3dv" },
   { path: "NURBS/NurbsPositionInterpolator.x3d" },
   { path: "NURBS/NurbsPositionInterpolatorExample.x3dv" },
   { path: "NURBS/NurbsSurfaceInterpolator.x3d" },
   { path: "NURBS/NurbsSweptSurface.x3d" },
   { path: "NURBS/NurbsSwungSurface.x3d" },
   { path: "NURBS/NurbsTextureCoordinate.x3dv" },
   { path: "NURBS/Rectangle2D.x3dv" },
   { path: "NURBS/torus.x3d" },
   { component: "Navigation" },
   { path: "Navigation/Billboard.x3d" },
   { path: "Navigation/ClonedLOD.x3d" },
   { path: "Navigation/Depth.x3d" },
   { path: "Navigation/Gravitation.x3d" },
   { path: "Navigation/ScreenScale.x3d" },
   { path: "Navigation/ViewpointJump.x3d" },
   { path: "Navigation/ViewpointLayers.x3d" },
   { path: "Navigation/WalkViewer.x3d" },
   { component: "Networking" },
   { path: "Networking/Anchor.x3d" },
   { path: "Networking/LoadSensor.x3d" },
   { path: "Networking/autoRefresh.x3dv" },
   { component: "PROTO" },
   { path: "PROTO/27cubes.x3d" },
   { path: "PROTO/Double.x3dv" },
   { path: "PROTO/ExternProto.x3d" },
   { path: "PROTO/ExternProto.x3dv" },
   { path: "PROTO/NestedProtos.x3d" },
   { path: "PROTO/Rotor.wrl" },
   { path: "PROTO/cbx.wrl" },
   { path: "PROTO/cbx.wrl.gz" },
   { path: "PROTO/test.x3d" },
   { path: "PROTO/test.x3dv" },
   { component: "ParticleSystems" },
   { path: "ParticleSystems/BoundedPhysicsModel.x3d" },
   { path: "ParticleSystems/Bubbles.x3d" },
   { path: "ParticleSystems/ConeEmitter.x3d" },
   { path: "ParticleSystems/Dolphin.x3d" },
   { path: "ParticleSystems/DolphinLineSurfaceEmitter.x3d" },
   { path: "ParticleSystems/DolphinPointSurfaceEmitter.x3d" },
   { path: "ParticleSystems/DolphinPointVolumeEmitter.x3d" },
   { path: "ParticleSystems/DolphinQuadSurfaceEmitter.x3d" },
   { path: "ParticleSystems/DolphinSurfaceEmitter.x3d" },
   { path: "ParticleSystems/Earth.x3dz" },
   { path: "ParticleSystems/ExplosionEmitter.x3d" },
   { path: "ParticleSystems/Fire.x3d" },
   { path: "ParticleSystems/Geometry.x3d" },
   { path: "ParticleSystems/GeometryLine.x3d" },
   { path: "ParticleSystems/GridTool.x3dv" },
   { path: "ParticleSystems/OpenVolume.x3d" },
   { path: "ParticleSystems/PointEmitter.x3d" },
   { path: "ParticleSystems/PolylineEmitter.x3d" },
   { path: "ParticleSystems/Smoke.x3d" },
   { path: "ParticleSystems/SurfaceEmitter.x3d" },
   { path: "ParticleSystems/Tunnel.x3dv" },
   { path: "ParticleSystems/VolumeEmitter-U.x3d" },
   { path: "ParticleSystems/VolumeEmitter.x3d" },
   { path: "ParticleSystems/Waterfall.x3d" },
   { component: "Picking" },
   { path: "Picking/LinePickSensorGeometry.x3d" },
   { path: "Picking/PointPickSensorGeometry.x3d" },
   { path: "Picking/PrimitivePickSensorBounds.x3d" },
   { path: "Picking/PrimitivePickSensorGeometry.x3d" },
   { path: "Picking/VolumePickSensorBounds.x3d" },
   { path: "Picking/VolumePickSensorGeometry.x3d" },
   { component: "PointingDeviceSensor" },
   { path: "PointingDeviceSensor/ClonedSensors.x3d" },
   { path: "PointingDeviceSensor/LineSensor.x3d" },
   { path: "PointingDeviceSensor/PlaneSensor.x3d" },
   { path: "PointingDeviceSensor/SphereSensor.x3d" },
   { path: "PointingDeviceSensor/TouchLines.x3dv" },
   { path: "PointingDeviceSensor/TouchPoints.x3dv" },
   { path: "PointingDeviceSensor/lamp.x3d" },
   { path: "PointingDeviceSensor/test.x3d" },
   { component: "ProjectiveTextureMapping" },
   { path: "ProjectiveTextureMapping/Local.x3d" },
   { path: "ProjectiveTextureMapping/Parallel.x3d" },
   { path: "ProjectiveTextureMapping/Perspective.x3d" },
   { path: "ProjectiveTextureMapping/apple.x3d" },
   { component: "Rendering" },
   { path: "Rendering/ClipPlane.x3d" },
   { path: "Rendering/IndexedLineSet.x3d" },
   { path: "Rendering/IndexedTriangleSetSphere.x3d" },
   { path: "Rendering/L-System.x3dz" },
   { path: "Rendering/cubes.x3d" },
   { path: "Rendering/world.x3d" },
   { component: "RigidBodyPhysics" },
   { path: "RigidBodyPhysics/Ball.x3d" },
   { path: "RigidBodyPhysics/BallBounceSimple.x3d" },
   { path: "RigidBodyPhysics/BallJoint.x3d" },
   { path: "RigidBodyPhysics/DoubleAxisHingeJoint.x3d" },
   { path: "RigidBodyPhysics/ElevationGrid.x3d" },
   { path: "RigidBodyPhysics/Hierarchy.x3d" },
   { path: "RigidBodyPhysics/KineticPendulum.x3d" },
   { path: "RigidBodyPhysics/MotorJoint.x3d" },
   { path: "RigidBodyPhysics/Rectangle2D.x3d" },
   { path: "RigidBodyPhysics/SingleAxisHingeJoint.x3d" },
   { path: "RigidBodyPhysics/SliderJoint.x3d" },
   { path: "RigidBodyPhysics/SliderJoint2.x3d" },
   { path: "RigidBodyPhysics/UniversalJoint.O.x3d" },
   { path: "RigidBodyPhysics/UniversalJoint.x3d" },
   { component: "Scripting" },
   { path: "Scripting/AddRemoveRootNode.x3d" },
   { path: "Scripting/AddRemoveRoute.x3d" },
   { path: "Scripting/BaseNodeDispose.x3d" },
   { path: "Scripting/ColorSpheres.x3d" },
   { path: "Scripting/ExternProto.x3d" },
   { path: "Scripting/MURCIELAGO640.x3dj" },
   { path: "Scripting/Proto.x3d" },
   { path: "Scripting/Pyramid.x3d" },
   { path: "Scripting/SFNode.x3d" },
   { path: "Scripting/createVrmlFromString.x3d" },
   { path: "Scripting/createX3DFromString.x3dv" },
   { path: "Scripting/createX3DFromURL.x3dv" },
   { path: "Scripting/geodome.wrl" },
   { path: "Scripting/load-viewpoints.x3d" },
   { path: "Scripting/rotation.x3dv" },
   { path: "Scripting/string.x3dv" },
   { path: "Scripting/test.x3d" },
   { path: "Scripting/toXMLString.x3d" },
   { path: "Scripting/toXMLString.x3dj" },
   { component: "Shaders" },
   { path: "Shaders/ColorManagement.x3d" },
   { path: "Shaders/ComposedShaderUniformRotation.x3d" },
   { path: "Shaders/Fields.x3d" },
   { path: "Shaders/FloatVertexAttribute.x3d" },
   { path: "Shaders/LineFloatVertexAttribute.x3d" },
   { path: "Shaders/LineMatrix3VertexAttribute.x3d" },
   { path: "Shaders/LineMatrix4VertexAttribute.x3d" },
   { path: "Shaders/Mandelbox.x3d" },
   { path: "Shaders/Matrix3VertexAttribute.x3d" },
   { path: "Shaders/Matrix4VertexAttribute.x3d" },
   { path: "Shaders/Mountains.x3d" },
   { path: "Shaders/Pipeline.x3d" },
   { path: "Shaders/PointFloatVertexAttribute.x3d" },
   { path: "Shaders/PointMatrix3VertexAttribute.x3d" },
   { path: "Shaders/PointMatrix4VertexAttribute.x3d" },
   { path: "Shaders/Shading.x3d" },
   { path: "Shaders/Waves.x3d" },
   { path: "Shaders/Wireframe.x3d" },
   { path: "Shaders/images.x3d" },
   { component: "Shape" },
   { path: "Shape/Connectors.x3d" },
   { path: "Shape/CopperGold.x3d" },
   { path: "Shape/FillProperties.x3d" },
   { path: "Shape/LineProperties.x3d" },
   { path: "Shape/LineProperties.x3dv" },
   { path: "Shape/BackMaterial.x3d" },
   { path: "Shape/UnlitMaterial.x3d" },
   { path: "Shape/Transparency.x3dv" },
   { path: "Shape/TwoSidedMaterial.x3d" },
   { path: "Shape/UnlitTexture.x3d" },
   { path: "Shape/NormalTexture.x3d" },
   { path: "Shape/SpecularTexture.x3d" },
   { path: "Shape/OcclusionTexture.x3d" },
   { component: "Sound" },
   { path: "Sound/AudioClip.wrl" },
   { path: "Sound/AudioClip.x3d" },
   { path: "Sound/Sound.x3d" },
   { component: "Text" },
   { path: "Text/Poetica-ChanceryI.otf" },
   { path: "Text/charcodes.x3d" },
   { path: "Text/date.x3d" },
   { path: "Text/default.x3d" },
   { path: "Text/horizontal.x3d" },
   { path: "Text/scrolling-text.x3d" },
   { path: "Text/test.x3d" },
   { path: "Text/vertical.x3d" },
   { component: "Texturing" },
   { path: "Texturing/ColorManagement.x3d" },
   { path: "Texturing/ColorMaterial.x3d" },
   { path: "Texturing/DataURL.x3d" },
   { path: "Texturing/Felulet.x3d" },
   { path: "Texturing/MovieTexture.x3d" },
   { path: "Texturing/MultiTexture.x3d" },
   { path: "Texturing/MultiTextureParticle.x3d" },
   { path: "Texturing/TextureCoordinateGenerator.x3d" },
   { path: "Texturing/ubuntu.x3d" },
   { component: "Texturing3D" },
   { path: "Texturing3D/Angio.nrrd" },
   { path: "Texturing3D/Angio.x3d" },
   { path: "Texturing3D/ComposedTexture3D.x3d" },
   { path: "Texturing3D/DEMRI.nrrd" },
   { path: "Texturing3D/DEMRI.x3d" },
   { path: "Texturing3D/ImageTexture3D.x3d" },
   { path: "Texturing3D/NRRD-ascii.x3d" },
   { path: "Texturing3D/NRRD-gzip.x3d" },
   { path: "Texturing3D/NRRD-hex.x3d" },
   { path: "Texturing3D/NRRD-raw.x3d" },
   { path: "Texturing3D/PixelTexture3D.x3d" },
   { path: "Texturing3D/Volume.x3d" },
   { path: "Texturing3D/ascii.nrrd" },
   { path: "Texturing3D/backpack.nrrd" },
   { path: "Texturing3D/gzip.nrrd" },
   { path: "Texturing3D/hex.nrrd" },
   { path: "Texturing3D/raw.nrrd" },
   { component: "Time" },
   { path: "Time/Clock.x3d" },
   { path: "Time/TimeProto.x3d" },
   { component: "VolumeRendering" },
   { path: "VolumeRendering/BasicInternals.x3d" },
   { path: "VolumeRendering/BlendedBodyInternals.x3d" },
   { path: "VolumeRendering/BlendedComposedVolumes.x3d" },
   { path: "VolumeRendering/BoundaryEnhancementVentricles.x3d" },
   { path: "VolumeRendering/CartoonBackpack.x3d" },
   { path: "VolumeRendering/ComposedBackpack.x3d" },
   { path: "VolumeRendering/EdgeBrain.x3d" },
   { path: "VolumeRendering/IsoSurfaceSkull.x3d" },
   { path: "VolumeRendering/ProjectionAverageVentricles.x3d" },
   { path: "VolumeRendering/ProjectionMaxVentricles.x3d" },
   { path: "VolumeRendering/ProjectionMinVentricles.x3d" },
   { path: "VolumeRendering/SegmentedVentricles.x3d" },
   { path: "VolumeRendering/ShadedBrain.x3d" },
   { path: "VolumeRendering/SilhouetteSkull.x3d" },
   { path: "VolumeRendering/VolumeData.x3d" },
   { path: "VolumeRendering/datasets" },
];
X_ITE_TESTS .server = "https://rawgit.com/create3000/Library/main/Tests/Components";
