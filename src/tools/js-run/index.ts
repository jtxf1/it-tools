import { BrandJavascript } from '@vicons/tabler'
import { translate } from '@/plugins/i18n.plugin'
import { defineTool } from '../tool'

export const tool = defineTool({
  name: translate('tools.js-run.title'),
  path: '/js-run',
  description: translate('tools.js-run.description'),
  keywords: ['js', 'run'],
  component: () => import('./js-run.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2025-11-21'),
})