import React from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/userSlice";
import Skeleton from "react-loading-skeleton";

function NouserBio({ bios }) {
  const profile = useSelector(selectProfile);

  return (
    <div className="p-4 w-full max-w-screen flex items-center justify-center shadow-lg">
      <div className="w-1/3 flex flex-grow items-center justify-center">
        <img
          className="rounded-full h-40 w-40 lg:h-80 lg:w-80 flex"
          alt={`${profile?.fullName} profile picture`}
          src={profile?.image}
        />
      </div>
      <div className="ml-3 w-3/5 lg:w-full">
        <div className="flex flex-col">
          <div className={`flex flex-wrap lg:flex-row items-center space-x-4`}>
            <p className="text-2xl mr-4 uppercase">
              {profile?.profileUsername}
            </p>
          </div>
        </div>
        <div className="flex item-center mt-4 space-x-2 lg:space-x-4">
          {!profile?.followers || !profile?.following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-sm lg:text-base">{profile?.photosCount}</p>
                <p className="text-sm lg:text-base font-bold">photos</p>
              </div>
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-sm lg:text-base">
                  {profile?.followersCount}
                </p>
                <p className="text-sm lg:text-base font-bold">
                  {profile?.followersCount === 1 ? `follower` : `followers`}
                </p>
              </div>
              <div className="flex flex-row space-x-1 items-center">
                <p className="text-sm lg:text-base">
                  {profile?.followingCount}
                </p>
                <p className="text-sm lg:text-base font-bold">following</p>
              </div>
            </>
          )}
        </div>
        <div className="container mt-4 hidden lg:inline-flex">
          <p className="font-medium">
            {!profile?.fullName ? (
              <Skeleton count={1} height={24} />
            ) : (
              profile?.fullName
            )}
          </p>
        </div>
        <div className=" p-2 w-full h-auto">
          <p className="text-base -ml-2">{bios}</p>
        </div>
      </div>
    </div>
  );
}

export default NouserBio;
