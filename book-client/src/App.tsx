import React, {useEffect, useState} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, HttpLink} from '@apollo/client';
import './App.css';
import {Book} from './generated/graphql';
import {useGetAllBooksDeferredQuery, GetAllBooksQuery} from './generated/graphql';
import {loadErrorMessages, loadDevMessages} from "@apollo/client/dev";

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();


function App() {
    const [books, setBooks] = useState<Book[]>([]);

    const {data, loading, error} = useGetAllBooksDeferredQuery();

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
                                <div key={id} className="book-card">
                                    <p className="title">{title}</p>
                                    {author ? <p className="author">by {author}</p> :
                                        <p className="author unknown-author">by unknown author</p>}
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
    uri: 'http://localhost:8088/api/graphql',
    headers: {'token': 'hello'},
    fetchOptions: {
        mode: 'cors'
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