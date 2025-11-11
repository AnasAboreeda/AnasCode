import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Organisms/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

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
