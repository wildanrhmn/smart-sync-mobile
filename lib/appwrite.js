import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  platform: "com.wnr.smartsync",
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66229f14ca9431a44548",
  databaseId: "6622a26c4e50b074eec4",
  userCollectionId: "6622a276139d6327e93d",
  videoCollectionId: "6622a881bd5ef7da2929",
  storageId: "6622a9d9d886d5699320",
};

const {
  platform,
  endpoint,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client();

client.setEndpoint(endpoint);
client.setProject(projectId);
client.setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (username, email, password) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await userLogin(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const userLogin = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const userLogout = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();

    const userData = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", user.$id)]
    );

    if (!userData) throw new Error();

    return userData.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUserBookmarks = async (query) => {
  try {
    const user = await account.get();

    const userData = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", user.$id)]
    );

    if (!userData) throw new Error();

    const bookmarks = userData.documents[0].bookmarks;
    if (query)
      return bookmarks.filter((bookmark) => bookmark.title.includes(query));
    return userData.documents[0].bookmarks.reverse();
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const postData = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    if (!postData) throw new Error("Something went wrong");

    return postData.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPostsByQuery = async (query) => {
  try {
    const postData = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search("title", query)]
    );

    if (!postData) throw new Error("Something went wrong");

    return postData.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPostsByUser = async (userId) => {
  try {
    const postData = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId)]
    );

    if (!postData) throw new Error("Something went wrong");

    return postData.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPostById = async (id) => {
  try {
    const postData = await databases.getDocument(
      databaseId,
      videoCollectionId,
      id
    );

    if (!postData) throw new Error("Something went wrong");

    return postData;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const postData = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    if (!postData) throw new Error("Something went wrong");

    return postData.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const bookmarkVideo = async (videoId, userId) => {
  try {
    const userData = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );

    let bookmarked = [videoId];

    for (let i = 0; i < userData.bookmarks.length; i++) {
      bookmarked.push(userData.bookmarks[i].$id);
    }

    await databases.updateDocument(databaseId, userCollectionId, userId, {
      bookmarks: bookmarked,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const unbookmarkVideo = async (videoId, userId) => {
  try {
    const userData = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );

    await databases.updateDocument(databaseId, userCollectionId, userId, {
      bookmarks: userData.bookmarks.filter(
        (bookmark) => bookmark.$id !== videoId
      ),
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file.uri) return file;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFilePreview(storageId, fileId);
    } else {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    }
  } catch (error) {
    throw new Error(error);
  }

  if (!fileUrl) throw new Error("Something went wrong");

  return fileUrl;
};

export const submitVideo = async (data) => {
  try {
    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadFile(data.video, "video"),
      uploadFile(data.thumbnail, "image"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: data.title,
        prompt: data.prompt,
        creator: data.creator,
        video: videoUrl,
        thumbnail: thumbnailUrl,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateVideo = async (id, data) => {
  try {
    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadFile(data.video, "video"),
      uploadFile(data.thumbnail, "image"),
    ]);

    await databases.updateDocument(
      databaseId,
      videoCollectionId,
      id,
      {
        title: data.title,
        prompt: data.prompt,
        video: videoUrl,
        thumbnail: thumbnailUrl,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};
