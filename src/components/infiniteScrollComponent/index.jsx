import React, { useEffect, useRef } from "react";
import { Text } from "zmp-ui";

const InfiniteScrollComponent = ({
  dataLength,
  children,
  loader,
  fetchMore,
  hasMore,
  endMessage = "Không còn dữ liệu",
  className,
}) => {
  const pageEndRef = useRef(null);

  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      });

      if (pageEndRef.current) {
        observer.observe(pageEndRef.current);
      }

      return () => {
        if (pageEndRef.current) {
          observer.unobserve(pageEndRef.current);
        }
      };
    }
  }, [hasMore]);

  return (
    <div className={className}>
      {children}

      {hasMore ? <div ref={pageEndRef}>{loader}</div> : ""}
      {!hasMore && dataLength > 10 ? (
        <Text.Title size="large" className="text-center mt-5">
          {endMessage}
        </Text.Title>
      ) : (
        ""
      )}
    </div>
  );
};

export default InfiniteScrollComponent;
