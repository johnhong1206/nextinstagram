import { useEffect, useState, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useDispatch, useSelector } from "react-redux";
import db from "../../config/firebase";
import { closeviewStoriesModal } from "../../features/modalSlice";
import { viewStories, quitViewedStory } from "../../features/storiesSlice";
function ViewStoriesModal() {
  const dispatch = useDispatch();
  const storyUserId = useSelector(viewStories);
  const [stories, setStorires] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const fetchStories = () => {
      unsubscribe = db
        .collection("stories")
        .where("userId", "==", storyUserId)
        .onSnapshot((snapshot) => {
          setStorires(
            snapshot?.docs.map((doc) => ({
              id: doc?.id,
              ...doc?.data(),
            }))
          );
        });
    };

    fetchStories();
    return unsubscribe;
  }, [db, storyUserId]);

  const quitView = () => {
    dispatch(quitViewedStory());
    dispatch(closeviewStoriesModal());
  };

  console.log(stories);

  return (
    <div onClick={quitView} className="fixed z-50 inset-1 overflow-y-auto ">
      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="">
          <Carousel
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            interval={10000}
          >
            {stories.map((story) => (
              <div key={story?.id} onClick={quitView}>
                <img
                  src={story?.image}
                  className="w-[550px] h-[550px] object-contain"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default ViewStoriesModal;

{
  /**   {story.map((story) => (
              <div onClick={quitView}>
                <img
                  src={story?.images}
                  className="w-[550px] h-[550px] object-contain"
                />
              </div>
            ))} */
}
