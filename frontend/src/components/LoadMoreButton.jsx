import React from 'react'

const LoadMoreButton = ({ hasMore, onClick, loading }) => {
  if (!hasMore) return null;
  return (
    <button className='load-more-btn' onClick={onClick} disabled={loading}>
      {loading ? 'Loading...' : 'Load More'}
    </button>
  )
}

export default LoadMoreButton