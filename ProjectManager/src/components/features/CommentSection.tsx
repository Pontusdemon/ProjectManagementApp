import { useState, type FormEvent } from "react"
import { useAppState } from "@/state/app-state-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatShortDate } from "@/lib/dates"
import { createId } from "@/lib/ids"
import { getInitials, getUserById } from "@/lib/selectors"

const MAX_COMMENT_LENGTH = 1000

interface CommentSectionProps {
  taskId: string
}

const CommentSection = ({ taskId }: CommentSectionProps) => {
  const { state, actions } = useAppState()
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)

  const comments = state.comments
    .filter((comment) => comment.taskId === taskId)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedBody = body.trim()

    if (trimmedBody.length === 0) {
      setError("Write a comment before posting.")
      return
    }

    actions.addComment({
      id: createId("comment"),
      taskId,
      authorId: state.currentUserId,
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    })
    setBody("")
    setError(null)
  }

  return (
    <section aria-labelledby="task-comments-heading" className="space-y-4 border-t pt-4">
      <h3 id="task-comments-heading" className="text-sm font-medium">
        Comments
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Start the conversation below.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const author = getUserById(state.users, comment.authorId)

            return (
              <li key={comment.id} className="flex items-start gap-3">
                <Avatar size="sm" aria-hidden="true">
                  <AvatarFallback>
                    {author ? getInitials(author.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{author?.name ?? "Unknown user"}</span>{" "}
                    <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
                      {formatShortDate(comment.createdAt)}
                    </time>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {comment.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <Label htmlFor="task-comment-body">Add a comment</Label>
        <Textarea
          id="task-comment-body"
          value={body}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          placeholder="Write a comment..."
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "task-comment-error" : undefined}
          onChange={(event) => {
            setBody(event.target.value)
            if (error) setError(null)
          }}
        />
        {error && <p id="task-comment-error" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={body.trim().length === 0}>
            Post comment
          </Button>
        </div>
      </form>
    </section>
  )
}

export default CommentSection