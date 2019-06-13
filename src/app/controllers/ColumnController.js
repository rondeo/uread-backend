const Column = require('../models/Column')

module.exports = {
  async get(req, res) {
    const column = await Column.find().sort('-createdAt')
    return res.json(column)
  },
  async create(req, res) {
    const { title, description } = req.body
    const user = req.userId
    const column = await Column.create({
      title,
      description,
      user,
      writers: [user]
    })

    return res.json(column)
  },
  async update(req, res) {
    const { title, description } = req.body
    const column = await Column.findByIdAndUpdate(req.params.id, {
      title,
      description
    }, { new: true })

    return res.json(column)
  },
  async subscribe(req, res) {
    const column = await Column.findById(req.params.id)
    column.subscriptions.push(req.userId)

    await column.save()
    return res.json(column)
  },
  async unsubscribe(req, res) {
    let column = await Column.findById(req.params.id)
    column.subscriptions = column.subscriptions.filter(sub => sub != req.userId)

    await column.save()
    return res.json(column)
  }
}
