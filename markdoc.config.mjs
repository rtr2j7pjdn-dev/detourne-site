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
    photo: {
      render: component('./src/components/Photo.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
      },
    },
    quote: {
      render: component('./src/components/PullQuote.astro'),
      attributes: {
        text: { type: String, required: true },
        cite: { type: String },
      },
    },
    youtube: {
      render: component('./src/components/YouTubeEmbed.astro'),
      attributes: {
        id: { type: String, required: true },
        title: { type: String },
      },
    },
  },
});
