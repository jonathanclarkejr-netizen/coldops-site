export const metadata = {
  title: 'ColdOps.ai',
  description: 'Outbound Leads, Delivered with Precision.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
