import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import LogoRow from './LogoRow';

const meta: Meta<typeof LogoRow> = {
  title: 'Components/Organisms/LogoRow',
  component: LogoRow,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof LogoRow>;

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
