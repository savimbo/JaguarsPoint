
// List the important geocodes on the legal land plot/ Enumerar los geocódigos importantes de la parcela legal
var punto2083 = ee.Geometry.Point([-76.79881506876836, 0.8807609191486939]);
var punto2084 = ee.Geometry.Point([-76.80160881659556, 0.8618816822233319]);
var punto2085 = ee.Geometry.Point([-76.80164041784578, 0.8590049487377004]);
var punto2086 = ee.Geometry.Point([-76.79349882713599, 0.8670727583341657]);


// Construct, and export a polygon for the legal land plot/ Construir y exportar un polígono para la parcela legal
var pruebaplot100H = ee.Geometry.Polygon(
  [
   punto2083,
   punto2084,
   punto2085,
   punto2086
   
  ]
);
//find the centroid
var pruebaplot100H_centroid = pruebaplot100H.centroid({'maxError': 1});

//export the important variables for metaanalytics
exports.polygon = pruebaplot100H;
exports.centroid = pruebaplot100H_centroid;