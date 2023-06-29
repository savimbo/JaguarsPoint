The main code resides in the file jaguares.js, which invokes the file pruebajaguares_chart.js containing the coordinates of the jaguars, and the file pruebaplot100H.js that specifies the location of the farm. The code should be executed in Google Earth Engine, which can be accessed at https://earthengine.google.com/.

The objective of this algorithm is to incorporate additional fields in the Google Earth Engine metadata, such as:

| Field         | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| id_specie     | Unique identifier of the species                                  |
| coordinates   | Geographic coordinates (latitude, longitude) of the sighting     |
| dates         | Dates on which the species sightings were recorded               |
| radius        | Radius representing the extent of the sighting in hectares       |
| credit level  | Credit level assigned to the species, can be "gold", "silver", or "bronze" based on hierarchy |

The algorithm takes the date of each sighting and generates a 60-day range by subtracting 30 days from the sighting date and adding 30 days to it. This 60-day range represents a credit per hectare.

Example 1

In the case of multiple sightings and intersecting species ranges, we will avoid double payment for the same hectare. The following example illustrates this process:

**Table 1: Jaguar Sightings Data**

| Jaguar    | Sighting Date |
| --------- | ------------- |
| Jaguar 1  | 2023-01-01    |
| Jaguar 2  | 2023-01-10    |

**Table 2: Date Ranges for Each Jaguar**

| Jaguar    | Sighting Date | Date Range                      |
| --------- | ------------- | ------------------------------- |
| Jaguar 1  | 2023-01-01    | 2022-12-02 to 2023-01-31        |
| Jaguar 2  | 2023-01-10    | 2022-12-11 to 2023-02-09        |

**Table 3: Radius and Area Information**

| Area (plot1)  | Jaguar 1 Radius | Jaguar 2 Radius | Intersection |
| ------------- | --------------- | --------------- | ------------ |
| 100 hectares  | 30 hectares     | 30 hectares     | 10 hectares  |

**Table 4: Assigned Credits per Hectare**

| Date Range                      | Credits per Day     |
| ------------------------------- | ------------------- |
| 2022-12-11 to 2023-01-31        | 50 hectares per day |
| 2022-12-02 to 2022-12-10        | 30 hectares per day |
| 2023-02-01 to 2023-02-09        | 30 hectares per day |

This way, the algorithm calculates the credits per hectare based on the sightings, dates, radii, and species intersections in a given area.
