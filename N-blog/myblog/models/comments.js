const marked = require('marked')
const Comment = require('../lib/mongo').Comment

// 将comment的content从markdown转换为html
Comment.plugin('commentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一个留言
  create: function create (comment) {
    return Comment.create(comment).exec()
  },

  // 通过留言id获取一个留言
  getCommentById: function getCommentById (commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },

  // 通过文章id删除一个留言
  delCommentById: function delCommentById (commentId) {
    return Comment.deleteOne({_id: commentId}).exec()
  },

  // 通过文章 id 删除该文章下所有留言
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.deleteMany({postId: postId}).exec()
  },

  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments: function getComments (postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .commentToHtml()
      .exec()
  },

  // 通过文章 id 获取该文章下留言数
  getCommentsCount: function getCommentsCount (postId) {
    return Comment.count({postId: postId}).exec()
  }
}
