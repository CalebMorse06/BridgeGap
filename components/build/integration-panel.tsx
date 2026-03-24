'use client'

import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { type Integration } from '@/types'

const INTEGRATIONS_CONFIG = [
  {
    id: 'stripe' as const,
    icon: '💳',
    title: 'Accept Payments',
    description: 'Let customers pay deposits or full amounts online.',
    defaultEnabled: false,
    badge: 'Test mode',
    badgeVariant: 'default' as const,
  },
  {
    id: 'twilio' as const,
    icon: '📱',
    title: 'SMS Notifications',
    description: 'Automatic booking confirmations and reminders via text.',
    defaultEnabled: false,
    badge: 'Test mode',
    badgeVariant: 'default' as const,
  },
  {
    id: 'resend' as const,
    icon: '📧',
    title: 'Email Notifications',
    description: 'Get notified every time someone books, registers, or signs up.',
    defaultEnabled: true,
    badge: 'Free',
    badgeVariant: 'success' as const,
  },
  {
    id: 'analytics' as const,
    icon: '📊',
    title: 'Basic Analytics',
    description: 'See how many people visit your app and take action.',
    defaultEnabled: true,
    badge: 'Free',
    badgeVariant: 'success' as const,
  },
]

interface IntegrationPanelProps {
  integrations: Integration[]
  onToggle: (index: number, enabled: boolean) => void
  onDeploy: () => void
  subdomain: string
}

export function IntegrationPanel({ integrations, onToggle, onDeploy, subdomain }: IntegrationPanelProps) {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>⚡</span> Optional Features
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Toggle on what you need. Change anytime.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {INTEGRATIONS_CONFIG.map((config, i) => {
            const integration = integrations[i]
            return (
              <div key={config.id} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="text-xl mt-0.5">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-gray-900">{config.title}</span>
                    <Badge variant={config.badgeVariant} className="text-[10px] px-1.5 py-0">
                      {config.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{config.description}</p>
                </div>
                <Switch
                  checked={integration?.enabled ?? config.defaultEnabled}
                  onCheckedChange={(checked) => onToggle(i, checked)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <Button size="xl" className="w-full text-base font-semibold" onClick={onDeploy}>
          Generate & Deploy My App
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-center text-xs text-gray-400 mt-2.5">
          Deploying to{' '}
          <span className="font-medium text-gray-600 font-mono">
            {subdomain ? `${subdomain}.vibedeploy.app` : 'yourapp.vibedeploy.app'}
          </span>
        </p>
      </div>
    </div>
  )
}

export { INTEGRATIONS_CONFIG }
