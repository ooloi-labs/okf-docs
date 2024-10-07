
# Api reference for GetData Endpoint:

## Overview

The `GET /api/discovery/getData` API endpoint retrieves discovery data based on specified configurations, including content types, filters, sorting options, and other parameters.

## Endpoint

GET https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData


## Request


### Request Headers

Header |	Type |	Required |	Description                                                                                                 |
|---------------------|----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tenant`           | String     | Yes      | Identifier for the tenant making the request.  |
| `x-auth-token` | String | No | The token for authenticating the request.|


### Query Parameters

| Parameter Name      | Type     | Required | Description                                                                                                                                          |
|---------------------|----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `configs`           | JSON     | Yes      | A JSON string containing various configuration options for the query, including content types, filters, sorting, population data, and more.       |



### Configs Keys Description

|Key	|Type	|Required	|Description|
|----------|-----------|------------|------------|
| `contentTypes`     | Array    | Yes      | An array of content types to filter the data, e.g., `["caseReports"]`.                                                                              |
| `activeFilters`    | Array    | Yes      | An array of filter objects that define how to filter the data based on different criteria, such as states and districts.                             |
| `activeSort`       | Object   | Yes      | An object defining the sorting criteria. The keys are the field names to sort by, and the values are `1` for ascending or `-1` for descending order. |
| `searchTerm`       | String   | No       | A string used to search for specific terms in the dataset.                                                                                          |
| `population`       | Array    | No       | An array of objects that define additional data to be included in the response. Each object specifies the path, model, and fields to select from related data. |
| `findQuery`        | Object   | Yes      | An object defining conditions to match specific documents, e.g., the published status of reports.                                                    |
| `lookupConfig`     | Array    | No       | An array of lookup objects that define how to join or enrich data from other collections (e.g., user data for contributors).                         |
| `ksConfig`         | String   | No       | A string for additional configuration options specific to the knowledge system, if applicable.                                                      |
| `useAggregation`   | Boolean  | Yes      | A flag indicating whether to use aggregation methods in the query (e.g., for complex filtering or grouping).                                        |
| `activeLang`       | String   | Yes      | A string specifying the language for the response.  Ex- `en`                                                                                                 |
| `skip`             | Number   | Yes      | An integer indicating how many records to skip in the results, useful for pagination.                                                               |



### Different values of 

|Key |	Values|
|---------------------|----------|
| `contentTypes`      |   `["newsReports","tenderDocuments","surveyReports","proceedings","caseReports","guidelines"]`   | 
| `activeSort` | `{"kp_date_published":-1}` or `{"kp_date_published":1}` | 
| `activeLang` | `en` | 


## Response

| Parameter Name      | Type     | Description                                                                                                                                          |
|---------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `count`           | Number     |  The number of documents returned in the data or the size of data array       |
| `skip`           | Number     |  The skip amount for the number of documents, used in pagination requests.      |
| `data`           | JSON Array    |  A JSON Array containing containing the document object resulting from the request.       |


### Sample Response Object

```
{
  "comments": [],
  "kp_date_created": "2022-09-16T10:26:51.245Z",
  "kp_date_last_saved": "2024-01-10T05:31:20.729Z",
  "kp_date_published": "2024-01-10T05:31:20.729Z",
  "kp_published_status": "published",
  "lookup": {
    "newsReports": [
      {
        "_id": "666aa271ee3cad000bcd3c01"
      }
    ]
  },
  "main": {
    "title": "Andaman & Nicobar Island edit"
  },
  "meta": {
    "kp_contributed_by": "64a406ab8112a525b47c815e",
    "kp_content_type": "states"
  },
  "metadata": {
    "contentType": "states",
    "isContentType": "true",
    "segment": "collections"
  },
  "tagId": "andaman_nicobar_island",
  "taggedResources": {
    "surveyReports": {
      "collectionId": "surveyReports"
      // Additional fields...
    },
    "caseReports": {
      "collectionId": "caseReports"
      // Additional fields...
    }
    // Other resource types...
  },
  "taggedResourcesCount": {
    "newsReports": 1,
    "tenderDocuments": 0,
    "surveyReports": 2,
    "proceedings": 1,
    "caseReports": 7
  },
  "updates": [],
  "warnings": [],
  "__v": 0,
  "_id": "63244f6b5e5676e7181365ad"
}


```
