import React from "react";
import Skeleton from "react-loading-skeleton";
import { AiFillHeart } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import Image from "next/image";

function UserPhoto({ photo }) {
  return (
    <div className="">
      <div className="">
        {!photo ? (
          new Array(12)
            .fill(0)
            .map((_, i) => <Skeleton key={i} width={320} height={400} />)
        ) : (
          <div key={photo.docId} className="relative group cursor-pointer">
            <div className="xl:ml-10 p-2 group cursor-pointer transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50">
              <Image
                src={photo.image}
                objectFit="contain"
                width={400}
                height={400}
              />
            </div>
            <div
              style={{
                "background-image": `linear-gradient(rgb(0,0,0,0.5),rgb(0,0,0,0.5)), `,
              }}
              className="absolute bottom-0 left-0 bg-gradient-to-t from-[#000000] z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden object-contain"
            >
              <p className="flex items-center text-gray-200 font-bold">
                <AiFillHeart
                  className={`w-8 h-8 mr-4 select-none cursor-pointer focus:outline-none text-gray-100 `}
                />
                {photo.likes.length}
              </p>
              <p className="flex items-center text-gray-200 font-bold">
                <BsFillChatFill
                  className={`w-8 h-8 mr-4 select-none cursor-pointer focus:outline-none text-gray-100 `}
                />
                {photo.comments.length}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="pb-10" />
    </div>
  );
}

export default UserPhoto;
