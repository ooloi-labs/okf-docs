---
title: "Content APIs Overview"
---

| API            | [General Access Validation](#general-access-validation) | [Document Exists Check](#document-exists-check) | [Check Access Against Doc Status](#check-access-against-doc-status) | [Check Authorship Rights](#check-authorship-rights) | [Document Status Update Framework](#document-status-update-framework) | [Document Metadata Update Framework](#document-metadata-update-framework) | [Clone Handling](#clone-handling) | [Update Tagged Resources](#update-tagged-resources) | [Transaction Applied](#transaction-applied) | [Have Plugins Been Run](#have-plugins-been-run) |
|-------------------------|--------------------------|-----------------------|-------------------------------|-------------------------|---------------------------------|----------------------------------|---------------|-------------------------|--------------------|---------------------|
| getContentForEdit            | :white_check_mark:                      | :white_check_mark:                   | :white_check_mark:                           | :white_check_mark:                     | :white_check_mark:                             | :white_check_mark:                              | :white_check_mark:           | :x:                      | :white_check_mark:                | :x:                  |
| submitContent OR publishContent  | :white_check_mark:                      | :white_check_mark:                   | :white_check_mark:                           | :white_check_mark:                     | :white_check_mark:                             | :white_check_mark:                              | :white_check_mark:           | :white_check_mark:                      | :white_check_mark:                | :white_check_mark:                 |
| deleteContent  | :white_check_mark:                      | :white_check_mark:                   | :x:                           | :white_check_mark:                     | :x:                             | :x:                              | :white_check_mark:           | :white_check_mark:                      | :white_check_mark:                | :x:                 |
| updateContent  | :white_check_mark:                      | :white_check_mark:                   | :x:                           | :white_check_mark:                     | :x:                             | :x:                              | :x:          | :x:                      | :white_check_mark:                | :x:                 |
| viewContent  | :white_check_mark:                      | :white_check_mark:                   | :white_check_mark:                           |   :x:                   | :x:                             | :x:                              | :x:          | :x: | :x:                       | :x:                 |
| createContent OR createAndPublishContent  | :white_check_mark:                      | :x:                   | :x:                           |   :x:                   | :white_check_mark:                             | :white_check_mark:                              | :x:          | if action is CREATE_AND_PUBLISH then :white_check_mark: else :x: | :white_check_mark:                       | :white_check_mark:                 |
| createAndPublishMultipleContent  | :white_check_mark:                      | :x:                   | :x:                           |   :x:                   | :x:                             | :white_check_mark:                              | :x:          | :x: | :white_check_mark:                       | :x:                |
| quickUpdateContent  | :white_check_mark:                      | :white_check_mark:                   | :white_check_mark:                           |   :x:                   | :x:                             | :white_check_mark:                              | :x:          | :white_check_mark: | :white_check_mark:                       | :x:                |

[Click here to see figjam diagrams](https://www.figma.com/board/Rb8AvD2z6Dwh29Fmj1e9ot/CONTENT-%26-MODERATION-MASTER?node-id=533-784&t=ia92bAllS8jPrqRl-0)

These APIs are used to view, create, update, delete, submit and publish.
For a better understanding, we have divided the content APIs into two major parts:
* Validation/Error handling
* Data Modification

## Validation/Error Handling
This section of the content APIs deals with access validation and error handling. It checks who and under what circumstances can the data be viewed, modified or basically a specific action can be performed. Additionally, it is responsible for error handling in case of unauthorised access.
This section is divided into 4 parts:
* General Access Validation
* Document Exists Check
* Check Access Against Doc Status
* Check Authorship Rights

## Data Modification
This section of the content APIs deals with modification, status update, metadata update, clone handling and tag updates. This section is divided into 4 parts:
* Document Status Update Framework
* Document Metadata Update Framework
* Clone Handling
* Update Tagged Resources

### General Access Validation
 * checks whether the user has access to the API OR a specific action
 * Possible ACTIONS: READ, SUBMIT, PUBLISH, DELETE, UPDATE, MODERATE, READ_IF_MEMBER
 * If the user has no access then it throws an error with the appropriate error message
 * [see the pictorial view here](https://www.figma.com/board/Rb8AvD2z6Dwh29Fmj1e9ot/CONTENT-%26-MODERATION-MASTER?node-id=514-717&t=tCHU8BchBUATD1X2-0)

### Document Exists Check
 * Checks for the existence of the document and if not found it throws general_resourceNotFound error

### Check Access Against Doc Status
 * It checks whether the document is available for the user to perform the specific action the user try to do based on the current status of the document

### Check Authorship Rights
 * Checks whether the user is the author or the current editor based on the segment provided
 * If the segment is collections or staticPages it checks whether the user is current editor or not
 * If the segment is publishing then it checks whether the user is author(creator of the document) or not

### Document Status Update Framework
Document Status Update Framework updates the status of a document.
Possible statuses are draft, awaitingModeration, underModeration, published, sentBack and editPublished.

[Click here for detailed explanation](./doc-status-based-action.md)

### Document Metadata Update Framework
 * This updates general informations about the document by updating the fields like kp_published_status, kp_date_submitted, kp_date_mod_begin, "lastActivity.date", kp_date_published, kp_date_last_saved

### Clone Handling
Clone Handling

### Update Tagged Resources
Imagine you have two lists of items, one labeled "prev"  and the other labeled "updated". Each list has different categories, and under each category, there are tags.
First, we check which list has more categories and use that as our main reference. Then, we go through each category and compare the tags from both lists.

If a category exists in "prev" but not in "updated," it means all its tags are new additions in "updated."
If a category exists in "updated" but not in "prev," it means all its tags have been removed in "updated."

If a category exists in both lists, we compare the tags:
* Tags that were in "prev" but are missing in "updated" are removed tags.
* Tags that are newly added in "updated" but were not in "prev" are new additions.

### Transaction Applied
Represents whether MongoDB transaction applied or not. Transactions ensure multiple operations succeed or fail together, maintaining data integrity.

### Have plugins been run
Represents whether an API contains tenant specific logic.