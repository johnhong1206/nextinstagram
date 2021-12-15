import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
const Posts = dynamic(() => import("../../Posts/Posts"));

function Timeline({ photo }) {
  return (
    <div className="container p-4 lg:p-0 col-span-3 lg:col-span-2">
      {!photo ? (
        <>
          <Skeleton count={1} height={61} />
        </>
      ) : (
        photo.map((content) => <Posts key={content.docId} content={content} />)
      )}
    </div>
  );
}

export default Timeline;
