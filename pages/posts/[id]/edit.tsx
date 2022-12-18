import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Main from '../../../components/Main/index';
import { Post } from '../../../models/post';
import { get, put } from '../../../utils/api';
import { useCallback } from 'react';
import { Value, Form } from '../../../components/Form/index';
import { useBlockNavigation } from '../../../hooks/useBlockNavigation';
import { NavigationHeader } from '../../../components/NavigationHeader/index';
import { useAuthorization } from '../../../hooks/useAuthorization';

type Props = {
  post?: Post | null;
}

export default function EditPage(props: Props) {
  const { isAuthorized } = useAuthorization()

  const toParams = useCallback((value: Value) => ({
    post: {
      title: value.title,
      body: value.body,
      published_at: value.publishedAt.toISOString(),
      status: value.status,
    }
  }), [])

  const toValues = useCallback((post: Post) => ({
    title: props.post.title,
    body: props.post.body,
    publishedAt: props.post.published_at ? new Date(props.post.published_at) : null,
    status: post.status,
  }), [])

  const handleSubmit = useCallback(async (value: Value) => {
    const res = await put(`/posts/${props.post.id}`, toParams(value))
    return {
      isSuccess: res.ok,
    }
  }, [])

  if (!props.post) {
    return null
  }

  useBlockNavigation()

  return (
    <>
      <Head>
        <title>記事を編集する - gaaamiiのブログ</title>
      </Head>

      <NavigationHeader />
      <Main>
        {isAuthorized ? <Form onSubmit={handleSubmit} value={toValues(props.post)} /> : null}
      </Main>
    </>
  )
}

type Query = {
  id: string;
}
export async function getServerSideProps(context: GetServerSidePropsContext<Query>) {
  const res = await get(`/posts/${context.params.id}`)
  const post = res.ok ? await res.json() : null

  return {
    props: {
      post,
    },
  }
}
