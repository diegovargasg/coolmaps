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
);out;>;out qt;
