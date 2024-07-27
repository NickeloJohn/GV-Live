const { transformImageUrl } = require('../utils/transform');

const buildDataForLive = (post) => {
  return [
    {
      url: `${post.id}.m3u8`,
      type: 'm3u8',
      placeholder: post.media?.placeholder || '',
      thumbnail: post.media?.thumbnail ? transformImageUrl(post.media.thumbnail) : 'https://placehold.it/100x100'
    }
  ];
};

const buildDataForMedia = (media) => {
  return media.map((item) => {
    return {
      url: transformImageUrl(item),
      type: item.type,
      placeholder: item?.placeholder || '',
      thumbnail: transformImageUrl(item?.thumbnail)
    };
  });
};

const transformAuthor = (user) => {
  return {
    id: user?._id || user.id || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    fullname: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePicture: user?.profilePicture || 'https://placehold.it/100x100',
    totalFollower: user?.totalFollower || 0,
    totalFollowing: user?.totalFollowing || 0,
    isFollowed: user?.isFollowed || false
  };
};


const transformPost = (post, author, postLike) => {
  const data = {
    id: post.id,
    author: transformAuthor(author),
    title: post.title,
    description: post.description,
    tags: post.tags,
    media: post.isLive ? buildDataForLive(post) : buildDataForMedia(post.media),
    music: post.music ? transformImageUrl(post.music) : '',
    likes: post.likes,
    comments: post.comments,
    views: post.views,
    shares: post.shares,
    isAllowedComments: post.isAllowedComments || false,
    category: post.category,
    isLike: !!postLike,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };

  return data;
};

const transformPostsGallery = (post) => {
  return {
    id: post.id,
    media: post.isLive ? buildDataForLive(post) : buildDataForMedia(post.media),
    music: post.music ? transformImageUrl(post.music) : '',
    createdAt: post.createdAt
  };
};

module.exports = {
  transformPost,
  transformPostsGallery
};
