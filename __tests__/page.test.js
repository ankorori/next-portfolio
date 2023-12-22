import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  test('renders blog titles', async () => {
    const blogs = [
      { slug: 'blog-1', frontmatter: { title: 'Blog 1' } },
      { slug: 'blog-2', frontmatter: { title: 'Blog 2' } },
      { slug: 'blog-3', frontmatter: { title: 'Blog 3' } },
    ]
    const numberPages = 3

    jest.mock('./getAllBlogs', () => ({
      getAllBlogs: jest.fn().mockResolvedValue({ blogs, numberPages }),
    }))

    render(<Page />)

    await screen.findByText('Blog 1')
    await screen.findByText('Blog 2')
    await screen.findByText('Blog 3')
  })

  test('renders pagination', async () => {
    const blogs = [
      { slug: 'blog-1', frontmatter: { title: 'Blog 1' } },
      { slug: 'blog-2', frontmatter: { title: 'Blog 2' } },
      { slug: 'blog-3', frontmatter: { title: 'Blog 3' } },
    ]
    const numberPages = 3

    jest.mock('./getAllBlogs', () => ({
      getAllBlogs: jest.fn().mockResolvedValue({ blogs, numberPages }),
    }))

    render(<Page />)

    await screen.findByText('1')
    await screen.findByText('2')
    await screen.findByText('3')
  })
})