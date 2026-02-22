import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/books/$bookId/plot')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/books/$bookId/plot"!</div>
}
