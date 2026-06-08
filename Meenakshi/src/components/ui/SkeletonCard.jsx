import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-base" style={{ border: "1px solid var(--brd)", borderRadius: 16, overflow: "hidden", paddingBottom: 20 }}>
      <div className="sk-img" style={{ width: "100%", height: 240 }}></div>
      <div style={{ padding: "20px 20px 0" }}>
        <div className="skeleton-base sk-line w-3-4" style={{ height: 18, marginBottom: 12 }}></div>
        <div className="skeleton-base sk-line w-full" style={{ height: 12, marginBottom: 8 }}></div>
        <div className="skeleton-base sk-line w-full" style={{ height: 12, marginBottom: 8 }}></div>
        <div className="skeleton-base sk-line w-1-2" style={{ height: 16, marginBottom: 16 }}></div>
        <div className="skeleton-base sk-btn" style={{ height: 40, width: "100%", borderRadius: 8 }}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
      {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonHeroImage() {
  return <div className="skeleton-base" style={{ width: 140, height: 140, borderRadius: 20 }}></div>;
}

export function SkeletonSection({ count = 3 }) {
   return (
     <div style={{ marginBottom: 60 }}>
       <div className="skeleton-base sk-line w-1-4" style={{ height: 28, marginBottom: 24 }}></div>
       <SkeletonGrid count={count} />
     </div>
   );
}