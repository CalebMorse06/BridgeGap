import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const { projectId, projectName, templateType, data, notificationEmail } = await req.json()

    // Save to Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createAdminClient } = await import('@/lib/supabase/client')
      const admin = createAdminClient()

      await admin.from('submissions').insert({
        project_id: projectId,
        data,
        status: 'new',
      })

      // Increment submission count
      await admin.rpc('increment_stat', { project_id: projectId, stat_key: 'submissions' })
    }

    // Send notification email to business owner
    if (resend && notificationEmail) {
      const subject = getEmailSubject(templateType, projectName)
      const html = getEmailHtml(templateType, projectName, data)

      await resend.emails.send({
        from: 'VibeDeploy <notifications@vibedeploy.app>',
        to: notificationEmail,
        subject,
        html,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Submission error:', error)
    // Don't fail — the user-facing form should still show success
    return NextResponse.json({ ok: true, warning: 'Notification may have failed' })
  }
}

function getEmailSubject(templateType: string, projectName: string): string {
  switch (templateType) {
    case 'service_booking': return `📅 New booking request — ${projectName}`
    case 'restaurant_menu': return `🛒 New order — ${projectName}`
    case 'event_registration': return `🎉 New registration — ${projectName}`
    case 'waitlist': return `📋 New waitlist signup — ${projectName}`
    default: return `New submission — ${projectName}`
  }
}

function getEmailHtml(templateType: string, projectName: string, data: Record<string, string>): string {
  const rows = Object.entries(data)
    .filter(([k]) => k !== 'projectId')
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#6b7280;font-weight:500;white-space:nowrap;border-bottom:1px solid #f3f4f6;text-transform:capitalize">${k.replace(/_/g, ' ')}</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border-bottom:1px solid #f3f4f6">${v}</td>
      </tr>
    `).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 20px">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:28px 32px">
      <div style="font-size:24px;margin-bottom:8px">${getEmailIcon(templateType)}</div>
      <h2 style="color:#fff;margin:0;font-size:18px;font-weight:700">${getEmailTitle(templateType)}</h2>
      <p style="color:#bfdbfe;margin:4px 0 0;font-size:14px">${projectName}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:0">
      ${rows}
    </table>
    <div style="padding:20px 32px;border-top:1px solid #f3f4f6">
      <a href="https://vibedeploy.app/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none">View in Dashboard →</a>
      <p style="font-size:12px;color:#9ca3af;margin-top:16px">Sent by <a href="https://vibedeploy.app" style="color:#2563eb">VibeDeploy</a></p>
    </div>
  </div>
</body>
</html>`
}

function getEmailIcon(t: string) {
  return { service_booking: '📅', restaurant_menu: '🛒', event_registration: '🎉', waitlist: '📋' }[t] || '📬'
}

function getEmailTitle(t: string) {
  return { service_booking: 'New Booking Request', restaurant_menu: 'New Order', event_registration: 'New Registration', waitlist: 'New Waitlist Signup' }[t] || 'New Submission'
}
