import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface MealRecordFormProps {
  onSubmit: (data: {
    recordTime: Date;
    amount?: string;
    foodType?: string;
    notes?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function MealRecordForm({
  onSubmit,
  isLoading = false,
  onCancel,
}: MealRecordFormProps) {
  const now = new Date();
  const [time, setTime] = useState(
    now.toISOString().slice(0, 16)
  );
  const [amount, setAmount] = useState("");
  const [foodType, setFoodType] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        recordTime: new Date(time),
        amount: amount.trim() || undefined,
        foodType: foodType.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Time */}
      <div>
        <Label htmlFor="time" className="label-elegant">
          時間
        </Label>
        <Input
          id="time"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-elegant"
          disabled={isLoading}
        />
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="label-elegant">
          量（例：100g、1缶）
        </Label>
        <Input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100g"
          className="input-elegant"
          disabled={isLoading}
        />
      </div>

      {/* Food Type */}
      <div>
        <Label htmlFor="foodType" className="label-elegant">
          フードの種類
        </Label>
        <Input
          id="foodType"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          placeholder="ウェットフード、ドライフードなど"
          className="input-elegant"
          disabled={isLoading}
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="label-elegant">
          メモ
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="食べ残しがあったなど、気になることを記入"
          className="input-elegant min-h-24"
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="btn-elegant-primary flex-1"
          disabled={isLoading}
        >
          {isLoading ? "保存中..." : "保存"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
