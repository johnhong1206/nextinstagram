import firebase from "firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0;
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getSuggestedProfiles(userId, following) {
  let query = firebase.firestore().collection("users");

  if (following?.length > 0) {
    query = query.where("userId", "not-in", [...following, userId]);
  } else {
    query = query.where("userId", "!=", userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function getfollower(userId, following) {
  let query = firebase.firestore().collection("users");

  if (following?.length > 0) {
    query = query.where("userId", "in", [...following, userId]);
  } else {
    query = query.where("userId", "!==", userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function getPeopletoChat(userId) {
  let query = firebase.firestore().collection("chat");
  if (userId) {
    query.where("users", "in", userId);
  }
  const result = await query.limit(10).get();
  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (karl's profile)
  profileId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? firebase.firestore.FieldValue.arrayRemove(profileId)
        : firebase.firestore.FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, // currently logged in user document id (karl's profile)
  loggedInUserDocId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? firebase.firestore.FieldValue.arrayRemove(loggedInUserDocId)
        : firebase.firestore.FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      let userSavedPhoto = false;

      if (photo?.likes?.includes(userId)) {
        userLikedPhoto = true;
      }

      if (photo?.save?.includes(userId)) {
        userSavedPhoto = true;
      }

      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getMyPhotos(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  //console.log("myPhotos", userFollowedPhotos);

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      let userSavedPhoto = false;

      if (photo?.likes?.includes(userId)) {
        userLikedPhoto = true;
      }

      if (photo?.save?.includes(userId)) {
        userSavedPhoto = true;
      }

      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getStories(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("stories")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const storiesWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      let userSavedPhoto = false;

      if (photo?.likes?.includes(userId)) {
        userLikedPhoto = true;
      }

      if (photo?.save?.includes(userId)) {
        userSavedPhoto = true;
      }

      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  return storiesWithUserDetails;
}

export async function getMyStories(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("stories")
    .where("userId", "==", userId)
    .get();

  //console.log("firebsase", userId);

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  //console.log("firebase", userFollowedPhotos);

  const storiesWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      let userSavedPhoto = false;

      if (photo?.likes?.includes(userId)) {
        userLikedPhoto = true;
      }

      if (photo?.save?.includes(userId)) {
        userSavedPhoto = true;
      }

      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  return storiesWithUserDetails;
}

export async function getNoUserPhotos() {
  // [5,4,2] => following
  const result = await firebase.firestore().collection("photos").get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    photos.map(async (photo) => {
      let userLikedPhoto = false;
      let userSavedPhoto = false;

      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto, userSavedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername) // karl (active logged in user)
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile, //true false
  activeUserDocId, //self uesr id
  profileDocId, //target profile id
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}
