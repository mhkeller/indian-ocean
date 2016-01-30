Attempting to add support for geocsv files to Indian Ocean.

geocsv file format specifications - http://giswiki.hsr.ch/GeoCSV#GeoCSV_file_format_specification

Need to add support for both types: WKT and Point(X/Y)

WKT will be one column with the below supported formats:
* Point
* MultiPoint
* LineString
* MultiLineString
* Polygon
* MultiPolygon
* GeometryCollection
* ARC

[WKT](https://en.wikipedia.org/wiki/Well-known_text) is a text markup language that also supports these geometic objects:
* Geometry
* Triangle
* CircularString
* Curve
* MultiCurve
* CompoundCurve
* CurvePolygon
* Surface
* MultiSurface
* PolyhedralSurface
* TIN

Though I'm not sure if these additional objects are supported by geocsv.

Point(X/Y) is not the preferred geometry type for geocsv, but it should still be considered. Luckily, there's only one syntax for this type of geometry. It's two columns. One latitude one longitude.

Will need to run tests on each geocsv to see which geometry type is included. We could:
* Force standardized column headers and error when they aren't found. This would be easiest.
* Write tests to look for certain patterns and try and deduce column type. This will be more work for me but less work for the end user.


