// Load plot100H polygon
var pruebaplot100H = require("users/drea/map:pruebaplot100H");
var plot100H = pruebaplot100H.polygon;

// Calculate plot area in hectares
var plotArea = plot100H.area();
var plotAreaHectares = plotArea.divide(10000);

// Jaguar points
var points_jaguar_data = require("users/drea/map:pruebajaguares_chart");
// var points_jaguar_data = require("users/drea/map:pruebajaguares");
var puntos = points_jaguar_data.points;
var mergedPolygons = {};
var totalAreaByDay = ee.Dictionary();

// Add the plot100H layer to the map
Map.addLayer(plot100H, { color: 'gold' }, "plot100H");
Map.centerObject(plot100H);

// Print the total area of plot100H in hectares
var plot100HArea = plotArea.divide(10000).format('%.3f');
print('Total area of plot100H in hectares:', plot100HArea);

// Print the areas for each jaguar point
for (var i = 0; i < puntos.length; i++) {
  var point = puntos[i].geometry;
  var date = puntos[i].date;

  // Radius of jaguar
  var radius = 800; // Radius in meters
  var pointBuffer = point.buffer(radius); // Buffer distance: 800 meters
  // Intersection between jaguar and plot100H
  var intersection = plot100H.intersection(pointBuffer);
  var intersectionArea = intersection.area().divide(10000).format('%.3f');

  Map.addLayer(pointBuffer, { color: 'blue', opacity: 0.3 }, 'Circle ' + (i + 1));
  Map.addLayer(intersection, { color: 'red', opacity: 0.5 }, 'Intersection ' + (i + 1));

  print('Jaguar ' + (i + 1) + ' area in hectares:', intersectionArea, date.format('YYYY-MM-dd'));

  var day = ee.Date(date).get('day').format();

  if (!mergedPolygons[day]) {
    mergedPolygons[day] = ee.FeatureCollection([]);
  }
  mergedPolygons[day] = mergedPolygons[day].merge(intersection);

  // Calculate the area of the intersection in hectares
  var area = intersection.area().divide(10000);

  // Create a label for the day
  var dayLabel = ee.String('Day ')
    .cat(day)
    .cat('-')
    .cat(ee.Date(date).format('MM'))
    .cat('-')
    .cat(ee.Date(date).format('YYYY'));

  // Add the intersection area to the previous total area
  var previousArea = ee.Number(totalAreaByDay.get(dayLabel, 0));

  // Check if there is intersection, otherwise assign the value of one hectare
  var newArea = previousArea;
  if (area.gt(0)) {
    newArea = previousArea.add(area);
    totalAreaByDay = totalAreaByDay.set(dayLabel, newArea);
  } else {
    totalAreaByDay = totalAreaByDay.set(dayLabel, 1);
  }

  // Assign the intersection area to all dates within the range
  for (var j = -2; j <= 2; j++) {
    var dayOffset = ee.Date(date).advance(j, 'day');
    var dayOffsetLabel = ee.String('Day ')
      .cat(ee.Number(dayOffset.get('day')).format())
      .cat('-')
      .cat(dayOffset.format('MM'))
      .cat('-')
      .cat(dayOffset.format('YYYY'));

    // Check if the day label is within the range of the first date
    if (dayOffset.difference(date, 'day').abs().lte(3)) {
      if (area.gt(0)) {
        var newAreaOffset = ee.Number(totalAreaByDay.get(dayOffsetLabel, 0)).add(area);
        totalAreaByDay = totalAreaByDay.set(dayOffsetLabel, newAreaOffset);
      } else {
        totalAreaByDay = totalAreaByDay.set(dayOffsetLabel, 1);
      }
    }
    else {
      // Assign the previous area for days outside the range
      totalAreaByDay = totalAreaByDay.set(dayOffsetLabel, previousArea);
    }
  }
}

// Merge the intersected polygons for each Day
var mergedPolygonsList = Object.keys(mergedPolygons).map(function(day) {
  return mergedPolygons[day].union();
});

// Calculate the area of the merged polygons in hectares for each Day
var mergedPolygonAreas = mergedPolygonsList.map(function(mergedPolygon) {
  return mergedPolygon.geometry().area().divide(10000).getInfo();
});

// Evaluate and print the totalAreaByDay dictionary
totalAreaByDay.evaluate(function(result) {
  print('Total Area by Day:', result);

  // Convert the result to a feature collection
  var features = Object.keys(result).map(function(dayLabel) {
    var area = ee.Number(result[dayLabel]);
    return ee.Feature(null, { 'date': dayLabel, 'area': area });
  });

  // Create a chart of Total Area by Day
  var chart = ui.Chart.feature.byFeature(features, 'date', 'area')
    .setChartType('LineChart')
    .setOptions({
      title: 'Total Area by Day',
      hAxis: { title: 'Date' },
      vAxis: { title: 'Area (hectares)' },
    });

  // Display the chart
  print(chart);
});
