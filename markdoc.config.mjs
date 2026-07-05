import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    amazon: {
      render: component('./src/components/AmazonLink.astro'),
      attributes: {
        url: { type: String, required: true },
        label: { type: String, required: true },
      },
    },
  },
});
