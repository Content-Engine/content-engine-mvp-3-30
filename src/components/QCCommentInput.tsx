
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QCCommentInputProps {
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

const QCCommentInput = ({ onSubmit, onCancel }: QCCommentInputProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
    }
  };

  return (
    <div className="p-4 bg-muted/30 rounded-lg space-y-3">
      <Textarea
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[80px]"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!comment.trim()}>
          Add Comment
        </Button>
      </div>
    </div>
  );
};

export default QCCommentInput;
