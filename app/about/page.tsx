import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })
import Link from '@/components/Link'
import Timeline from '@/components/Timeline'

import educationData from '@/data/educationData'
import experienceData from '@/data/experienceData'
import certificatesData from '@/data/certificatesData'

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
  <AuthorLayout content={mainContent}>
    <MDXLayoutRenderer code={author.body.code} />

    {/* Education */}
    <div className="pt-8">
      <h2 className="text-3xl font-bold mb-4">Education</h2>
      <Timeline items={educationData} />
    </div>

    {/* Experience */}
    <div className="pt-8">
      <h2 className="text-3xl font-bold mb-4">Experience</h2>
      <Timeline items={experienceData} />
    </div>

    {/* Certificates */}
    <div className="pt-8">
      <h2 className="text-3xl font-bold mb-4">Certificates</h2>
      <Timeline items={certificatesData} />
    </div>
  </AuthorLayout>

    </>
  )
}


