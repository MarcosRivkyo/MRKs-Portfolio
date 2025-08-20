import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, message } = req.body
  if (!email || !message) {
    return res.status(400).json({ message: 'Email and message are required' })
  }

  try {
    await resend.emails.send({
      from: 'Portfolio <contact@mrkportfolio.com>',
      to: 'marcos.rivkyo@gmail.com',
      subject: 'Nuevo mensaje de contacto desde el portfolio',
      text: `De: ${email}\n\n${message}`,
    })

    res.status(200).json({ message: 'Correo enviado con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error enviando el correo' })
  }
}
