Attempting to add support for geocsv files to Indian Ocean.

geocsv file format specifications - http://giswiki.hsr.ch/GeoCSV#GeoCSV_file_format_specification

Need to add support for both types: WKT and Point(X/Y)

WKT will be one column with the below supported formats:
*Point
*MultiPoint
*LineString
*MultiLineString
*Polygon
*MultiPolygon
*GeometryCollection
*ARC

[WKT](https://en.wikipedia.org/wiki/Well-known_text) is a text markup language that also supports these geometic objects:
*Geometry
*Triangle
*CircularString
*Curve
*MultiCurve
*CompoundCurve
*CurvePolygon
*Surface
*MultiSurface
*PolyhedralSurface
*TIN

Though I'm not sure if these additional objects are supported by geocsv.
