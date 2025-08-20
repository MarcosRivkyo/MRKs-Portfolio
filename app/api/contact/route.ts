// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, message } = await req.json()

    // Envía el correo
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'marcosrivkyo@gmail.com',
      subject: `New contact from ${email}`,
      html: `<p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'Failed to send email' }, { status: 500 })
  }
}
