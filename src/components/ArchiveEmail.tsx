import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  archived: string[];
  onEmail: () => void;
}

export default function ArchiveEmail({ archived, onEmail }: Props) {
  return (
    <div className="mt-4">
      <h4>Archived Articles</h4>
      <ul>
        {archived.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <Button variant="info" onClick={onEmail} disabled={!archived.length}>
        Email Archived List
      </Button>
    </div>
  );
}
