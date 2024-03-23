import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  books: Array<Book>;
};


export type QueryBooksArgs = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GetAllBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBooksQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: number, title: string, author?: string | null }> };

export type GetAllBooksDeferredQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBooksDeferredQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: number, title: string } & ({ __typename?: 'Book', author?: string | null } | { __typename?: 'Book', author?: never })> };

export type GetAllBooksHeadersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBooksHeadersQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: number, title: string }> };


export const GetAllBooksDocument = gql`
    query GetAllBooks {
  books {
    id
    title
    author
  }
}
    `;

/**
 * __useGetAllBooksQuery__
 *
 * To run a query within a React component, call `useGetAllBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBooksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBooksQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBooksQuery, GetAllBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBooksQuery, GetAllBooksQueryVariables>(GetAllBooksDocument, options);
      }
export function useGetAllBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBooksQuery, GetAllBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBooksQuery, GetAllBooksQueryVariables>(GetAllBooksDocument, options);
        }
export function useGetAllBooksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBooksQuery, GetAllBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBooksQuery, GetAllBooksQueryVariables>(GetAllBooksDocument, options);
        }
export type GetAllBooksQueryHookResult = ReturnType<typeof useGetAllBooksQuery>;
export type GetAllBooksLazyQueryHookResult = ReturnType<typeof useGetAllBooksLazyQuery>;
export type GetAllBooksSuspenseQueryHookResult = ReturnType<typeof useGetAllBooksSuspenseQuery>;
export type GetAllBooksQueryResult = Apollo.QueryResult<GetAllBooksQuery, GetAllBooksQueryVariables>;
export const GetAllBooksDeferredDocument = gql`
    query GetAllBooksDeferred {
  books {
    id
    title
    ... @defer(label: "authordelay") {
      author
    }
  }
}
    `;

/**
 * __useGetAllBooksDeferredQuery__
 *
 * To run a query within a React component, call `useGetAllBooksDeferredQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBooksDeferredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBooksDeferredQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBooksDeferredQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>(GetAllBooksDeferredDocument, options);
      }
export function useGetAllBooksDeferredLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>(GetAllBooksDeferredDocument, options);
        }
export function useGetAllBooksDeferredSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>(GetAllBooksDeferredDocument, options);
        }
export type GetAllBooksDeferredQueryHookResult = ReturnType<typeof useGetAllBooksDeferredQuery>;
export type GetAllBooksDeferredLazyQueryHookResult = ReturnType<typeof useGetAllBooksDeferredLazyQuery>;
export type GetAllBooksDeferredSuspenseQueryHookResult = ReturnType<typeof useGetAllBooksDeferredSuspenseQuery>;
export type GetAllBooksDeferredQueryResult = Apollo.QueryResult<GetAllBooksDeferredQuery, GetAllBooksDeferredQueryVariables>;
export const GetAllBooksHeadersDocument = gql`
    query GetAllBooksHeaders {
  books {
    id
    title
  }
}
    `;

/**
 * __useGetAllBooksHeadersQuery__
 *
 * To run a query within a React component, call `useGetAllBooksHeadersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBooksHeadersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBooksHeadersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBooksHeadersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>(GetAllBooksHeadersDocument, options);
      }
export function useGetAllBooksHeadersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>(GetAllBooksHeadersDocument, options);
        }
export function useGetAllBooksHeadersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>(GetAllBooksHeadersDocument, options);
        }
export type GetAllBooksHeadersQueryHookResult = ReturnType<typeof useGetAllBooksHeadersQuery>;
export type GetAllBooksHeadersLazyQueryHookResult = ReturnType<typeof useGetAllBooksHeadersLazyQuery>;
export type GetAllBooksHeadersSuspenseQueryHookResult = ReturnType<typeof useGetAllBooksHeadersSuspenseQuery>;
export type GetAllBooksHeadersQueryResult = Apollo.QueryResult<GetAllBooksHeadersQuery, GetAllBooksHeadersQueryVariables>;