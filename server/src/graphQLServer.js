
import { GraphQLSchema } from 'graphql'
import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
import joinMonster from 'join-monster'

import config from './serverConfig.json'

console.log(JSON.stringify(config))

// import knex from 'knex'
var knex = require('knex')({
  client: 'mysql',
  connection: config
});

const { graphql } = require('graphql')
const { GraphQLServer } = require('graphql-yoga')


const User = new GraphQLObjectType({
  name: 'User',
  sqlTable: 'users',
  uniqueKey: 'user_id',
  fields: () => ({
    id: {
      type: GraphQLInt,
      sqlColumn: 'user_id'
    },
    name: {
      type: GraphQLString,
      sqlDeps: [ 'first_name', 'middle_name' ],
      resolve: user => `${user.first_name} ${user.middle_name}`
    },
    surname: {
      type: GraphQLString,
      sqlColumn: 'last_name'
    },
    interests: {
      type: new GraphQLList(Interest),
      junction: {
        sqlTable: 'user_interests',
        sqlJoins: [
          // first the parent table to the junction
          (userTable, junctionTable, args) => `${userTable}.user_id = ${junctionTable}.user_id`,
          // then the junction to the child
          (junctionTable, interestTable, args) => `${junctionTable}.controlled_vocab_entry_id = ${interestTable}.controlled_vocab_entry_id`
        ]
      }
    }
  })
})

const Interest = new GraphQLObjectType({
  name: 'Interest',
  sqlTable: 'controlled_vocab_entry_settings',
  uniqueKey: 'controlled_vocab_entry_id',
  fields: {
    id: {
      type: GraphQLInt,
      sqlColumn: 'controlled_vocab_entry_id'
    },
    text: {
      type: GraphQLString,
      sqlColumn: 'setting_value'
    }
  }
})

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(User),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, {}, sql => {
          // knex is a SQL query library for NodeJS. This method returns a `Promise` of the data
          return knex.raw(sql + ';').then(rows => rows[0]);
        },  {dialect: 'mysql'})
      }
    }
  })
})


const query1 = `{
  users {
    name,
    surname,
    interests {
      id,
      text
    }
  }
}`

const schema = new GraphQLSchema({
  description: 'a test schema',
  query: QueryRoot
})

const server = new GraphQLServer({
  schema
})

export default server