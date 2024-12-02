---
title: "Search"
description: "Description goes here"
sidebar_position: 3
---

> 📌 **Note:** We are utilizing `Elastic Search Cloud` as the search DB.

Documentation on the overall architecture of the platform’s search functionality.

## Key Points

- [Search Index](#search-index)
- [Sync Service](#sync-service)
- [Search Manager](#search-manager)

### Search Index

> 📌 **Note:** Search indexes are stored in `search_${env}.searchIndices`

Each search index is represented by the following search index document:

- **contentType**: `contentType`  
  _Description_: Indicates the collection name for which search should be enabled.

- **status**: `created | active | reindex | deleted | error`  
  _Description_: Indicates the current status of the search index.

  - **created**: The search index has been created and is ready for data synchronization.
  - **active**: The search index is searchable now.
  - **reindex**: The search index is currently searchable but is also scheduled for graceful reindexing.
  - **deleted**: The search index was deleted and is scheduled for data synchronization to stop.
  - **error**: The search index encountered runtime errors. Based on the stage of failure, the search index may or may not be searchable.

- **tenant**: `tenantId`  
  _Description_: Identifies the tenant associated with the search index.

- **indexVersion**: `number`  
  _Description_: Represents the current version of the search index. The default value is 1, with any number greater than 1 indicating the number of times it has been reindexed.

---

Example search index doc:

```json
{
  "contentType": "stories",
  "status": "active",
  "tenant": "tenantId",
  "indexVersion": 1
}
```

## Sync Service

The sync service is responsible for ensuring data consistency between MongoDB and Elasticsearch, running every 30 minutes to check for any pending data sync updates. If updates are found, they are scheduled for syncing.

### Key Functions of the Sync Service

> 📌 **Note:** The sync service utilizes [Monstache](https://rwynn.github.io/monstache/) for all data syncing between MongoDB and Elasticsearch

1. **Data Syncing**
   - The service syncs data from a specified MongoDB collection to an Elasticsearch index.
2. **Real-Time Updates**
   - A change stream is opened on the MongoDB collection to enable real-time data reads.

## Search Manager

The Search Manager can be accessed from the admin dashboard and is used for managing search functionality on the platform. The Search Manager includes several tabs, each serving a specific purpose:

## Tabs

1. **Overview**

   - Provides an overview of search activity on the platform.
   - Displays a table with document counts from MongoDB and Elasticsearch.

2. **Created**

   - Lists all search indexes with a status of `created` on the platform.
   - Delete search index.

3. **Active**

   - Lists all search indexes with a status of `active` on the platform.
   - Reindex search index.
   - Delete search index.

4. **Reindex**

   - Lists all search indexes with a status of `reindex` on the platform.

5. **Deleted**

   - Lists all search indexes with a status of `deleted` on the platform.

6. **Error**
   - Lists all search indexes with a status of `error` on the platform.
