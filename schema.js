const fetch = require('node-fetch')
const util = require('util')
const parceXML = util.promisify(require('xml2js').parseString)
const {
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType
} = require('graphql')

const bookType = new GraphQLObjectType({
  name: 'Book',
  description: '...',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: xml =>
        xml.title[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: xml =>
        xml.isbn[0]
    }
  })
})

const authorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].name[0]
    },
    books: {
      type: new GraphQLList(bookType),
      resolve: xml =>
        xml.GoodreadsResponse.author[0].books[0].book
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: authorType,
        args: {
          id: {type: GraphQLInt}
        },
        resolve: (root, args) => fetch(
          `https://www.goodreads.com/author/show.xml?id=${args.id}&key=MaABF05XNE3WMeOS0IDAQ`
        )
        .then(response => response.text())
        .then(parceXML)
      }
    })
  })
})
