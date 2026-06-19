import { PlusCircle, UploadCloud } from "lucide-react";

interface PostFoodFormProps {
  foodName: string;
  foodPrice: string;
  foodDetails: string;
  foodImage: File | null;
  posting: boolean;
  onFoodNameChange: (value: string) => void;
  onFoodPriceChange: (value: string) => void;
  onFoodDetailsChange: (value: string) => void;
  onFoodImageChange: (file: File | null) => void;
  onSubmit: () => void;
}

export const PostFoodForm = ({
  foodName,
  foodPrice,
  foodDetails,
  foodImage,
  posting,
  onFoodNameChange,
  onFoodPriceChange,
  onFoodDetailsChange,
  onFoodImageChange,
  onSubmit,
}: PostFoodFormProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-950">Post Food</h3>
          <p className="text-sm text-slate-500">Add a new menu item</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Food name
          </span>
          <input
            type="text"
            placeholder="e.g. Jollof rice"
            value={foodName}
            onChange={(e) => onFoodNameChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Price
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={foodPrice}
            onChange={(e) => onFoodPriceChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Details
          </span>
          <textarea
            placeholder="Describe ingredients, size, or prep details"
            value={foodDetails}
            onChange={(e) => onFoodDetailsChange(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Image
          </span>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
            <UploadCloud className="mx-auto h-6 w-6 text-slate-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFoodImageChange(e.target.files?.[0] || null)}
              className="mt-3 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            {foodImage && (
              <p className="mt-2 truncate text-xs text-slate-500">
                Selected: {foodImage.name}
              </p>
            )}
          </div>
        </label>

        <button
          onClick={onSubmit}
          disabled={posting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusCircle className="h-4 w-4" />
          {posting ? "Posting..." : "Post Food"}
        </button>
      </div>
    </section>
  );
};
