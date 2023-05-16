import PaymentsView from '../components/PaymentsView';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof PaymentsView>;
const meta: Meta<typeof PaymentsView> = {
  title: 'PaymentsView',
  component: PaymentsView,
};
export default meta;

export const Default: Story = {
  args: {
    priceList: [1200, 12000, 23000],
    parcelPrice: 3000,
  },
};
