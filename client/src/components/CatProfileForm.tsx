import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CatProfileFormProps {
  onSubmit: (data: {
    name: string;
    age?: number;
    breed?: string;
    photoUrl?: string;
  }) => Promise<void>;
  initialData?: {
    name: string;
    age?: number;
    breed?: string;
    photoUrl?: string;
  };
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CatProfileForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: CatProfileFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [age, setAge] = useState(initialData?.age?.toString() || "");
  const [breed, setBreed] = useState(initialData?.breed || "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("猫ちゃんの名前は必須です");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        age: age ? parseInt(age, 10) : undefined,
        breed: breed.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
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

      {/* Name */}
      <div>
        <Label htmlFor="name" className="label-elegant">
          名前 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: ミケ、タマ"
          className="input-elegant"
          disabled={isLoading}
        />
      </div>

      {/* Age */}
      <div>
        <Label htmlFor="age" className="label-elegant">
          年齢（歳）
        </Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="例: 3"
          className="input-elegant"
          disabled={isLoading}
          min="0"
          max="50"
        />
      </div>

      {/* Breed */}
      <div>
        <Label htmlFor="breed" className="label-elegant">
          品種
        </Label>
        <Input
          id="breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="例: スコティッシュフォールド"
          className="input-elegant"
          disabled={isLoading}
        />
      </div>

      {/* Photo URL */}
      <div>
        <Label htmlFor="photoUrl" className="label-elegant">
          写真URL
        </Label>
        <Input
          id="photoUrl"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://example.com/cat.jpg"
          className="input-elegant"
          disabled={isLoading}
          type="url"
        />
        {photoUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border">
            <img
              src={photoUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={() => setError("画像が読み込めません")}
            />
          </div>
        )}
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
