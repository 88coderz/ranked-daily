import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

interface Comment {
  id: string;
  user: string;
  text: string;
}

interface Props {
  articleId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function Comments({ articleId, comments, onAddComment }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
    }
  };

  return (
    <div>
      <ListGroup className="mb-3">
        {comments.map((c) => (
          <ListGroup.Item key={c.id}>
            <strong>{c.user}:</strong> {c.text}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentText">
          <Form.Control
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-2">Submit</Button>
      </Form>
    </div>
  );
}
