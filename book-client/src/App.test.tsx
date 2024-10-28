import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { MockedProvider } from '@apollo/client/testing';
import { GET_BOOK_BY_ID, GET_BOOKS_BY_AUTHOR, GET_BOOKS_BY_TITLE, ADD_BOOK, UPDATE_BOOK, DELETE_BOOK } from './queries';

const mocks = [
  {
    request: {
      query: GET_BOOK_BY_ID,
      variables: { id: 1 },
    },
    result: {
      data: {
        bookById: {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
        },
      },
    },
  },
  {
    request: {
      query: GET_BOOKS_BY_AUTHOR,
      variables: { author: 'George Orwell' },
    },
    result: {
      data: {
        booksByAuthor: [
          {
            id: 2,
            title: '1984',
            author: 'George Orwell',
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_BOOKS_BY_TITLE,
      variables: { title: 'Moby-Dick' },
    },
    result: {
      data: {
        booksByTitle: [
          {
            id: 3,
            title: 'Moby-Dick',
            author: 'Herman Melville',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_BOOK,
      variables: { title: 'New Book', author: 'New Author' },
    },
    result: {
      data: {
        addBook: {
          id: 4,
          title: 'New Book',
          author: 'New Author',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_BOOK,
      variables: { id: 1, title: 'Updated Title', author: 'Updated Author' },
    },
    result: {
      data: {
        updateBook: {
          id: 1,
          title: 'Updated Title',
          author: 'Updated Author',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_BOOK,
      variables: { id: 1 },
    },
    result: {
      data: {
        deleteBook: true,
      },
    },
  },
];

test('renders books', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => {
    const bookElement = screen.getByText(/The Great Gatsby/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('fetches book by ID', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/ID/i), { target: { value: '1' } });
  fireEvent.click(screen.getByText(/Fetch Book by ID/i));

  await waitFor(() => {
    const bookElement = screen.getByText(/The Great Gatsby/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('fetches books by author', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'George Orwell' } });
  fireEvent.click(screen.getByText(/Fetch Books by Author/i));

  await waitFor(() => {
    const bookElement = screen.getByText(/1984/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('fetches books by title', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Moby-Dick' } });
  fireEvent.click(screen.getByText(/Fetch Books by Title/i));

  await waitFor(() => {
    const bookElement = screen.getByText(/Moby-Dick/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('adds a new book', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Book' } });
  fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'New Author' } });
  fireEvent.click(screen.getByText(/Add Book/i));

  await waitFor(() => {
    const bookElement = screen.getByText(/New Book/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('updates a book', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/ID/i), { target: { value: '1' } });
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Updated Title' } });
  fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'Updated Author' } });
  fireEvent.click(screen.getByText(/Update Book/i));

  await waitFor(() => {
    const bookElement = screen.getByText(/Updated Title/i);
    expect(bookElement).toBeInTheDocument();
  });
});

test('deletes a book', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/ID/i), { target: { value: '1' } });
  fireEvent.click(screen.getByText(/Delete Book/i));

  await waitFor(() => {
    const bookElement = screen.queryByText(/The Great Gatsby/i);
    expect(bookElement).not.toBeInTheDocument();
  });
});
