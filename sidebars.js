/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // docsSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Overview',
      link: {
        type: 'generated-index',
        description: 'Overview Description',
      },
      items: [
        'overview/product-overview',
        {
          type: 'category',
          label: 'Product Architecture Diagram',
          link: {
            type: 'doc',
            id: 'overview/product-architecture-diagram/product-architecture-diagram',
          },
          items: [
            'overview/product-architecture-diagram/tag-architecture',
            'overview/product-architecture-diagram/annotation-architecture',
          ],
        },
        'overview/database-schema',
        'overview/code-architecture-and-writing-guidelines',
      ],
    },
    {
      type: 'category',
      label: 'Content',
      link: {
        type: 'generated-index',
        description: 'Content Description',
      },
      items: [
        'content/content-api',
        'content/review-api',
        'content/get-data-and-filters',
        'content/component-library',
        'content/rich-text-editor',
        'content/batch-registration',
        'content/listing-page-component',
        'content/caching',
      ],
    },
    {
      type: 'category',
      label: 'Tenant MGMT',
      link: {
        type: 'generated-index',
        description: 'Tenant MGMT Description',
      },
      items: [
        'tenant-mgmt/new-tenant-setup-checklist',
        'tenant-mgmt/authentication',
        'tenant-mgmt/access-control',
        'tenant-mgmt/platform-configurations',
        'tenant-mgmt/page-builder',
        'tenant-mgmt/analytics',
      ],
    },
    {
      type: 'category',
      label: 'Additional Features',
      link: {
        type: 'generated-index',
        description: 'Additional Features Description',
      },
      items: [
        {
          type: 'category',
          label: 'Analysis Features',
          link: {
            type: 'doc',
            id: 'additional-features/analysis-features/analysis-features',
          },
          items: [
            'additional-features/analysis-features/data-visualization',
          ],
        },
        'additional-features/plugins',
        'additional-features/search',
        'additional-features/chatbot',
        'additional-features/llms',
        'additional-features/csv-or-data-exports',
        'additional-features/pwa',
      ],
    },
    {
      type: 'category',
      label: 'Processes',
      link: {
        type: 'generated-index',
        description: 'Processes Description',
      },
      items: [
        'processes/code-management-process',
        'processes/configuration-sync-up',
        'processes/qa-processes',
      ],
    },
  ],
  apiDocSidebar: [
    'api-docs/intro',
    'api-docs/apis/getData',
  ],
};

export default sidebars;
