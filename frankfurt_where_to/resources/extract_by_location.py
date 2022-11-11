import processing

inputFile = 'D:/Projekte/coolmaps/frankfurt_bars/resources/frankfurt_sushi.geojson'
outputFile = 'D:/Projekte/coolmaps/frankfurt_bars/resources/frankfurt_sushi.gpkg'

processing.run("native:extractbylocation",\
{'INPUT':inputFile,\
'PREDICATE':[0],\
'INTERSECT':'D:/Projekte/coolmaps/frankfurt_bars/resources/frankfurt_shape/DEU_adm3.shp',\
'OUTPUT':outputFile})