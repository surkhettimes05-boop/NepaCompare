import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const postData = getPostData(params.slug);
  
  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: postData.title,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: 'article',
      publishedTime: postData.date,
      authors: [postData.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.description,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const postData = getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem', letterSpacing: '1px' }}>
            {postData.date} • BY {postData.author.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.3, marginBottom: '1.5rem', color: 'var(--text-color)' }}>
            {postData.title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {postData.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div className="card" style={{ padding: '2rem', fontSize: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .markdown-content h2 { margin-top: 2rem; margin-bottom: 1rem; color: var(--text-color); }
            .markdown-content h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--text-color); }
            .markdown-content p { margin-bottom: 1.25rem; }
            .markdown-content ul, .markdown-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
            .markdown-content li { margin-bottom: 0.5rem; }
            .markdown-content a { color: var(--primary-color); text-decoration: none; }
            .markdown-content a:hover { text-decoration: underline; }
          `}} />
          
          <div className="markdown-content">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {postData.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/blog" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
