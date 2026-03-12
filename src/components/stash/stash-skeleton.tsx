function StashCardSkeleton() {
  const skeletonStyle = {
    background: "linear-gradient(90deg, #ebebea 25%, #f7f6f3 50%, #ebebea 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.6s infinite linear",
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ ...skeletonStyle, width: "100%", height: "160px" }} />

      <div style={{ padding: "16px", display: "grid", gap: "8px" }}>
        <div
          style={{
            ...skeletonStyle,
            height: "14px",
            borderRadius: "6px",
            width: "75%",
          }}
        />

        <div
          style={{
            ...skeletonStyle,
            height: "12px",
            borderRadius: "6px",
            width: "50%",
          }}
        />
      </div>
    </div>
  );
}

export default StashCardSkeleton;
