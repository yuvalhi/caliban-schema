import React, {useEffect, useState} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, HttpLink, useMutation} from '@apollo/client';
import './App.css';
import {Book} from './generated/graphql';
import {useGetAllBooksDeferredQuery, GetAllBooksQuery, useGetBookByIdQuery, useGetBooksByAuthorQuery, useGetBooksByTitleQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation} from './generated/graphql';
import {loadErrorMessages, loadDevMessages} from "@apollo/client/dev";

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();


function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [bookId, setBookId] = useState<number | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    const {data, loading, error} = useGetAllBooksDeferredQuery();
    const {data: bookByIdData, loading: bookByIdLoading, error: bookByIdError} = useGetBookByIdQuery({variables: {id: bookId!}, skip: bookId === null});
    const {data: booksByAuthorData, loading: booksByAuthorLoading, error: booksByAuthorError} = useGetBooksByAuthorQuery({variables: {author: author!}, skip: author === null});
    const {data: booksByTitleData, loading: booksByTitleLoading, error: booksByTitleError} = useGetBooksByTitleQuery({variables: {title: title!}, skip: title === null});

    const [addBook] = useAddBookMutation();
    const [updateBook] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    useEffect(() => {
        if (data && data.books) {
            setBooks(data.books);
        }
    }, [data]);

    useEffect(() => {
        if (bookByIdData && bookByIdData.bookById) {
            setBooks([bookByIdData.bookById]);
        }
    }, [bookByIdData]);

    useEffect(() => {
        if (booksByAuthorData && booksByAuthorData.booksByAuthor) {
            setBooks(booksByAuthorData.booksByAuthor);
        }
    }, [booksByAuthorData]);

    useEffect(() => {
        if (booksByTitleData && booksByTitleData.booksByTitle) {
            setBooks(booksByTitleData.booksByTitle);
        }
    }, [booksByTitleData]);

    if (loading || bookByIdLoading || booksByAuthorLoading || booksByTitleLoading) return <p>Loading...</p>;
    if (error || bookByIdError || booksByAuthorError || booksByTitleError) return <div>
        <p>Error :( </p>
        <p>{error?.message}</p>
        <p>{error?.stack}</p>
        <p>{error?.name}</p>

        <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>

    const handleAddBook = async (title: string, author: string) => {
        try {
            const {data} = await addBook({variables: {title, author}});
            if (data && data.addBook) {
                setBooks([...books, data.addBook]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateBook = async (id: number, title: string, author: string) => {
        try {
            const {data} = await updateBook({variables: {id, title, author}});
            if (data && data.updateBook) {
                setBooks(books.map(book => book.id === id ? data.updateBook : book));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            const {data} = await deleteBook({variables: {id}});
            if (data && data.deleteBook) {
                setBooks(books.filter(book => book.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

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
                                    {author ?
                                        <p className={`author ${author !== 'unknown' ? 'emphasized-author' : ''}`}>by {author}</p> :
                                        <p className="author unknown-author">by unknown author</p>
                                    }
                                    <button onClick={() => handleUpdateBook(id, title, author)}>Update</button>
                                    <button onClick={() => handleDeleteBook(id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3>Add a new book</h3>
                            <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                            <input type="text" placeholder="Author" onChange={(e) => setAuthor(e.target.value)} />
                            <button onClick={() => handleAddBook(title!, author!)}>Add Book</button>
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
