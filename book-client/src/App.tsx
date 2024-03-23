import React, {useEffect, useState} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, HttpLink} from '@apollo/client';
import './App.css';
import {Book} from './generated/graphql';
import {useGetAllBooksQuery, GetAllBooksQuery} from './generated/graphql';
import {loadErrorMessages, loadDevMessages} from "@apollo/client/dev";
import {setContext} from '@apollo/client/link/context';

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();


function App() {
    const [books, setBooks] = useState<Book[]>([]);

    const {data, loading, error} = useGetAllBooksQuery();

    useEffect(() => {
        if (data && data.books) {
            setBooks(data.books);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <div>
        <p>Error :( </p>
        <p>{error.message}</p>
        <p>{error.stack}</p>
        <p>{error.name}</p>

        <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>

    return (
        <ApolloProvider client={client}>
            <div className="App">
                <header className="App-header">
                    <div>
                        <h2>Books</h2>
                        <div>
                            {books.map(({id, title, author}) => (
                                <div key={id}>
                                    <p>{title} by {author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>
            </div>
        </ApolloProvider>
    );
}

const httpLink = new HttpLink({
    uri: 'http://localhost:5015/api/graphql',
    headers: {'token': 'hello'},
    fetchOptions: {
        mode: 'no-cors'
    }
});



const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),

});
export default () => (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);