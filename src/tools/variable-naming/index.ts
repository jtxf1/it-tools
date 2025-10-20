import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Variable naming',
  path: '/variable-naming',
  description: '',
  keywords: ['variable', 'naming'],
  component: () => import('./variable-naming.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-10-20'),
});