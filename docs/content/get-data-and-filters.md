---
title: "Get Data & Filters"
description: "Description goes here"
sidebar_position: 3
---

The `GET /api/discovery/getData` API is used to fetch discovery-related data based on specific configurations provided by the user. It allows users to customize their queries by selecting different types of content, applying filters, sorting results, and even performing advanced searches. The API can handle different types of queries, such as simple data retrieval, counting the number of records, or more complex searches using aggregation techniques.

The API supports four main types of data retrieval methods, each designed for different purposes depending on the complexity and type of data you're looking for. Here’s a detailed explanation of each:

### 1. Count Data Queries:
This type of query is used when you only want to know **how many records** match certain conditions without retrieving the actual data itself. For example, if you want to count how many documents meet specific criteria like a certain content type or filter, you would use a "count" query. This is efficient when you're only interested in the count, as it avoids fetching unnecessary data.

**Example Use Case:** Counting the number of articles tagged under a specific category.

### 2. Find Data Queries (Simple Queries):
Find queries are used to **retrieve specific data** from the database. It’s like performing a basic search to get the documents (e.g., articles, profiles) that meet certain conditions. You can add filters, sort the results, and define how many records you want (with limits and skips). This is useful for straightforward data fetching without any aggregation or complex processing.

**Example Use Case:** Fetching a list of articles published after a certain date and sorted by date published.

### 3. Aggregate Data Queries:
These queries are more advanced and are used when you need to perform **complex data processing**, such as grouping data, counting data within specific categories, or combining data from different sources. It uses MongoDB's **aggregation pipeline**, which allows for powerful operations like filtering, sorting, lookup and performing calculations on the data. This is typically used when simple queries aren’t sufficient, and you need to do things like generating reports or summaries.

**Example Use Case:** Retrieving a breakdown of user profiles by country, state, district, etc., along with the total count of profiles in each region.

### 4. ElasticSearch Queries:
ElasticSearch queries are designed for **full-text search** and advanced filtering. If you want to search based on specific keywords or perform more sophisticated searches (such as matching terms within large sets of data), ElasticSearch is ideal. It’s particularly useful for searching content that involves free-text or keyword-based lookups, allowing for fast and efficient querying.

**Example Use Case:** Searching for articles that contain specific keywords within a large database of documents.
