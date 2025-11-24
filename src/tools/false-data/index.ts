import { HexagonOff } from '@vicons/tabler'
import { translate } from '@/plugins/i18n.plugin'
import { defineTool } from '../tool'

export const tool = defineTool({
  name: translate('tools.false-data.title'),
  path: '/false-data',
  description: translate('tools.false-data.description'),
  keywords: ['false', 'data'],
  component: () => import('./false-data.vue'),
  icon: HexagonOff,
  createdAt: new Date('2025-11-17'),
})