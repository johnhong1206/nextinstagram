import Image from "next/image";
import Link from "next/link";
import { Circle } from "better-react-spinkit";

function ExplorePost({ key, id, content, loading }) {
  return (
    <>
      <Link href={`/profile/${content?.userId}`} className="flex items-center">
        <div key={key} className="cursor-pointer hover:opacity-90">
          {!loading ? (
            <Image
              src={content.image}
              layout="responsive"
              height={1080}
              width={1920}
              quality="75"
              alt="poster"
            />
          ) : (
            <Circle color="#4c68d7" size={60} />
          )}
        </div>
      </Link>
    </>
  );
}

export default ExplorePost;
