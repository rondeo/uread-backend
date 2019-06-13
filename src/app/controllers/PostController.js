const Post = require('../models/Post')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
  async get(req, res) {
    const posts = await Post.find().sort('-createdAt')
    return res.json(posts)
  },
  async save(req, res) {
    const { author, place, description, tags } = req.body
    const { filename: image } = req.file

    const [name] = image.split('.')
    const fileName = `${name}.jpg`

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, 'resized', fileName))

    fs.unlinkSync(req.file.path)

    const post = await Post.create({
      author,
      place,
      description,
      tags,
      image: fileName
    })

    req.io.emit('newPost', post)

    return res.json(post)
  },
  async like(req, res) {
    const post = await Post.findById(req.params.id)

    post.likes += 1

    await post.save()

    req.io.emit('likePost', post)

    return res.json(post)
  }
}
