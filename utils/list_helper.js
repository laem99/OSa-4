var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    } else if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        const likes_sum = blogs.reduce(function (prev, cur) {
            return prev + cur.likes
        }, 0)
        return likes_sum
    }
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce(function (prev, cur) {
        return (prev.likes > cur.likes) ? prev : cur
    })
    return favorite
}

const mostBlogs = (blogs) => {
    const bloggerList = _.map(blogs, 'author')
    const recordBlogger = _.head(_(bloggerList)
        .countBy()
        .entries()
        .maxBy(_.last));
    const blogCount = _.countBy(bloggerList)
    //console.log({ author: recordBlogger, blogs: blogCount[recordBlogger] })
    return { author: recordBlogger, blogs: blogCount[recordBlogger] }
}

const mostLikes = (blogs) => {
    const maxLikesAuthor =  _.maxBy(blogs, function(a) {
        return a.likes
    });
    const AuthorBlogs = _.filter(blogs, function(b) {
        return b.author === maxLikesAuthor.author
    })
    const likeList = _.map(AuthorBlogs, 'likes')
    const allLikes = _.sum(likeList)
    return { author: maxLikesAuthor.author, total_likes: allLikes}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}