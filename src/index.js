import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';



const client = new ApolloClient({
  uri: "https://heroku-insta.herokuapp.com/v1/graphql",
  cache: new InMemoryCache()
})

// client.query({
//   query: gql`
//   query getTodos {
//     todos {
//       done
//       id
//       text
//     }
//   }
//   `
// }).then(data => console.log(data))

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

