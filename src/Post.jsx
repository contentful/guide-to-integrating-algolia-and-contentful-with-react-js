export const Post = ({ post }) => {
  const publishDate = new Date(post.fields.publishDate['en-US'])
  const displayDate = publishDate.toLocaleString('en-US', { month: 'long', year: 'numeric', day: '2-digit' })

  return (
    <a className="post-card-link-wrapper" href={post.fields.slug['en-US']}>
      <div className="post-card">
        <span className="post-card-category">{post.fields.category['en-US'].toUpperCase()}</span>
        <span className="post-card-title">{post.fields.title['en-US']}</span>
        <span className="post-card-footnote">
          {displayDate} <span className="">|</span> {post.fields.authors['en-US'].join(', ')}
        </span>
      </div>
    </a>
  )
}
