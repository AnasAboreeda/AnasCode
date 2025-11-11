import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import FooterSection from './FooterSection';

const meta: Meta<typeof FooterSection> = {
  title: 'Components/Organisms/FooterSection',
  component: FooterSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FooterSection>;

export const Default: Story = {};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'iphone6' },
  },
};
