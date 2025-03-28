---
title: "Redis Functions"
---

# Redis Utility Functions Documentation

## Overview
This module provides utility functions to interact with a Redis cache, primarily for storing and retrieving MongoDB documents of the collections tpls and platformConfigs. The key functionalities include:
- Connecting to a Redis instance.
- Loading data from MongoDB collections into Redis.
- Querying data from Redis with MongoDB-like filters.
- Caching and invalidating cache entries.

#### `collectionsAndSchema` (Array)
A predefined list of collections and their schemas that will be used for caching.
- This is primarily used internally by `loadCollectionsToCache`.  
- Modifications to this list should be done with caution, as it defines which collections are cached.  
---

### Redis Utility Functions
---

## **1. `connectRedis`**
### **Description**  
Establishes a connection to the Redis server and preloads collections into the cache.

### **Parameters**  
- No parameters required.

### **Usage Notes**  
- This function must be called before performing any Redis operations.
- If the connection fails, the process will exit with an error.

---

## Common parameters and possible values
`tenant` - Possible values: ved, cata, wqn, mhai, gsl, nkms, nanka, gtdc, gelabs, mad, bosh, demo

`modelName` - Possible values: tpl, platformConfigs

`type` -

Example values:

stories, newsReports, expressionOfInterest, etc. (if the modelName is tpl)

profileTypes, roles, deployment, etc. (if the modelName is platformConfigs)

## **2. `findInCache`**
### **Description**  
Retrieves documents from the Redis cache based on a MongoDB-like query. If data is not found in the cache, it will fetch from the database and update the cache.

### **Parameters**  
- **tenant** *(string, mandatory)* – The tenant identifier.  
- **modelName** *(string, mandatory)* – The collection to search in.  
- **query** *(object, optional)* – A MongoDB-like query to filter results (default: `{}`).  
Example query:
```javascript
{
  kp_content_type: "stories",
  status: { $in: ["published", "editPublished"] },
}
```
- **type** *(string, optional)* – If provided, only one document of this type will be fetched from the cache.

Example findInCache function call
```javascript
const tpls = await findInCache({ tenant: "gsl", modelName: "tpl", type: "stories", query: {
  kp_content_type: "stories",
  status: { "$in": ["published", "editPublished"] },
}});
```

### **Usage Notes**  
- If no query is provided, it returns all cached documents for the given `tenant` and `modelName`.  
- If data is not found in the cache, it fetches from the database and updates the cache.  
- The function supports MongoDB-like operators like `$ne` and `$in`.

---

## **3. `loadCollectionsToCache`**
### **Description**  
Loads data from specified MongoDB collections and caches them in Redis.

### **Parameters**  
- No parameters required.

### **Usage Notes**  
- Fetches data from predefined collections for all tenants and stores them in Redis.  
- If existing cache entries are found, they will be cleared before storing fresh data.  
- Should be called during initialization to ensure cached data is up to date.

---

## **4. `setInCache`**
### **Description**  
Stores a document in the Redis cache.

### **Parameters**  
- **tenant** *(string, mandatory)* – The tenant identifier.  
- **modelName** *(string, mandatory)* – The name of the collection where the data belongs.  
- **type** *(string, mandatory)* – The type of document being stored.  
- **val** *(object, mandatory)* – The document to be stored in the cache.  

### **Usage Notes**  
- If a document already exists with the same key, it will be overwritten.  
- Ensure that `type` is correctly set to maintain proper categorization in the cache.  

---

## **5. `invalidateCache`**
### **Description**  
Removes a specific cache entry and optionally replaces it with updated data.

### **Parameters**  
- **tenant** *(string, mandatory)* – The tenant identifier.  
- **modelName** *(string, mandatory)*.  
- **type** *(string, mandatory)* – The type of document to be invalidated.  
- **newVal** *(object, optional)* – If provided, this new value will be stored after cache invalidation.  

### **Usage Notes**  
- This function is intended to be used after a database operation to ensure the cache remains consistent.  
- If the `newVal` parameter is not provided, the cache entry will be deleted without replacement.  
- If setting `newVal` fails, the system will log the error but continue execution.  
-   According to the current usecases this function is called only after a database operation.
  We should include this function call within the MongoDB transaction.
  Otherwise, if the database operation succeeds but cache deletion fails, the cache will hold the outdated data.
  We can ignore setAsync failure as we are checking db also if cache is not present (inside findInCache function)

---

## **General Notes**
- Redis keys follow the pattern:  
  ```
  {environment}:{tenant}:{modelName}:{type}
  ```
  Example: `dev:gsl:tpl:stories`
- Functions should be used with proper tenant and model names to avoid data inconsistencies.
- Ensure that Redis is connected before performing cache operations.