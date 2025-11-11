import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SectionTitle from './SectionTitle';

const meta: Meta<typeof SectionTitle> = {
  title: 'Components/Molecules/SectionTitle',
  component: SectionTitle,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {
  args: {
    title: 'Section Title',
    description: 'This is a section description that provides context.',
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'Section Title Only',
  },
};

export const Desktop: Story = {
  args: {
    title: 'Why do you choose me',
    description: 'I am a Lead Software Engineer and data enthusiast who is self motivated, energized and good strategic planner',
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Mobile: Story = {
  args: {
    title: 'Why do you choose me',
    description: 'I am a Lead Software Engineer and data enthusiast who is self motivated, energized and good strategic planner',
  },
  parameters: {
    viewport: { defaultViewport: 'iphone6' },
  },
};
