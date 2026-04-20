import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="col-md-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden skeleton-wrapper">
        <div className="skeleton skeleton-image" style={{ height: '200px' }}></div>
        <div className="card-body">
          <div className="skeleton skeleton-text mb-2" style={{ width: '30%' }}></div>
          <div className="skeleton skeleton-text mb-3" style={{ height: '24px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;