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
General Access Validation

### Document Exists Check
Document Exists Check

### Check Access Against Doc Status
Check Access Against Doc Status

### Check Authorship Rights
Check Authorship Rights

### Document Status Update Framework
Document Status Update Framework

### Document Metadata Update Framework
Document Metadata Update Framework

### Clone Handling
Clone Handling

### Update Tagged Resources
Update Tagged Resources

### Transaction Applied
Transaction Applied

### Have plugins been run
Have plugins been run