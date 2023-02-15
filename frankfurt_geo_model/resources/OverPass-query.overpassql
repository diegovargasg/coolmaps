/*********************************************

This query is compiled by OSM Buildings.
It returns buildings for currently visible
map area.

Click RUN to run the query.
When done, click EXPORT to save the result.

If you are looking for:

- large areas and faster downloads
- additional data sets
- more file formats
- real 3d models from complex buildings
- consistent building types and attributes

All are available on https://3dbuildings.com/

*********************************************/

[out:json][timeout:30];(
way["building"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["building"]["type"="multipolygon"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["bridge"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["bridge"]["type"="multipolygon"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
);out;>;out qt;


/**Parks and Water***/

[out:json][timeout:40];(
way["water"="river"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["water"="river"]["type"="multipolygon"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["leisure"="park"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["leisure"="park"]["type"="multipolygon"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "secondary"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "secondary"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "service"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "service"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "tertiary"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "tertiary"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "primary"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "primary"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "residential"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "residential"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
way["highway"= "pedestrian"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
relation["highway"= "pedestrian"]["type"="LineString"](50.097458905220556,8.65199089050293,50.11661560039462,8.686494827270508);
);out;>;out qt;

[out:json][timeout:40];(
way["water"="river"]({{bbox}});
relation["water"="river"]["type"="multipolygon"]({{bbox}});
way["leisure"="park"]({{bbox}});
relation["leisure"="park"]["type"="multipolygon"]({{bbox}});
way["highway"= "secondary"]({{bbox}});
relation["highway"= "secondary"]["type"="LineString"]({{bbox}});
way["highway"= "service"]({{bbox}});
relation["highway"= "service"]["type"="LineString"]({{bbox}});
way["highway"= "tertiary"]({{bbox}});
relation["highway"= "tertiary"]["type"="LineString"]({{bbox}});
way["highway"= "primary"]({{bbox}});
relation["highway"= "primary"]["type"="LineString"]({{bbox}});
way["highway"= "residential"]({{bbox}});
relation["highway"= "residential"]["type"="LineString"]({{bbox}});
way["highway"= "pedestrian"]({{bbox}});
relation["highway"= "pedestrian"]["type"="LineString"]({{bbox}});
);out;>;out qt;
