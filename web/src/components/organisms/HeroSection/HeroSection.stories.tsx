import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import HeroSection from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/Organisms/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

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
