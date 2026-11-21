import { useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { AcquisitionType, AlchemyRecipe, RecipeCategory } from '../../shared/types';
import { CATALOG_ITEMS } from '../data/items';
import { toCopper } from '../lib/currency';

interface CustomRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (recipe: AlchemyRecipe, initialOutputOverrideCopper?: number) => void;
}

const CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'potion', label: 'Potion' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'protection', label: 'Protection' },
  { value: 'oil', label: 'Oil' },
  { value: 'flask', label: 'Flask' },
  { value: 'transmute', label: 'Transmute' },
];

const ACQUISITION_TYPES: { value: AcquisitionType; label: string }[] = [
  { value: 'ah', label: 'AH / Drop' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'reputation', label: 'Reputation' },
  { value: 'quest', label: 'Quest (Free)' },
];

export function CustomRecipeModal({ open, onClose, onCreate }: CustomRecipeModalProps) {
  const ingredientOptions = useMemo(
    () =>
      Object.values(CATALOG_ITEMS)
        .filter((i) => i.kind !== 'recipe')
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('potion');
  const [skillRequired, setSkillRequired] = useState('250');
  const [craftYield, setCraftYield] = useState('1');
  const [outputItemId, setOutputItemId] = useState('13444');
  const [customOutputPriceGold, setCustomOutputPriceGold] = useState('');
  const [customOutputPriceSilver, setCustomOutputPriceSilver] = useState('');

  const [ingredients, setIngredients] = useState<Array<{ itemId: number; qty: number }>>([
    { itemId: 13463, qty: 2 },
    { itemId: 8925, qty: 1 },
  ]);

  const [acqType, setAcqType] = useState<AcquisitionType>('trainer');
  const [sourceLabel, setSourceLabel] = useState('Custom Source');
  const [location, setLocation] = useState('Capital Cities');
  const [recipeCostGold, setRecipeCostGold] = useState('0');
  const [recipeCostSilver, setRecipeCostSilver] = useState('0');
  const [recipeScrollId, setRecipeScrollId] = useState('');

  if (!open) return null;

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, { itemId: 8838, qty: 1 }]);
  };

  const handleUpdateIngredient = (index: number, patch: Partial<{ itemId: number; qty: number }>) => {
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || ingredients.length === 0) return;

    const parsedOutputId = Math.max(1, parseInt(outputItemId, 10) || Date.now() % 900000 + 100000);
    const parsedScrollId = parseInt(recipeScrollId, 10);
    const fixedCostCopper =
      acqType === 'quest' || acqType === 'ah'
        ? 0
        : toCopper(Number(recipeCostGold), Number(recipeCostSilver), 0);

    const recipe: AlchemyRecipe = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      outputItemId: parsedOutputId,
      category,
      skillRequired: Math.min(300, Math.max(1, parseInt(skillRequired, 10) || 1)),
      yield: Math.max(1, parseInt(craftYield, 10) || 1),
      ingredients: ingredients.map((ing) => ({
        itemId: ing.itemId,
        qty: Math.max(1, Math.floor(ing.qty) || 1),
      })),
      recipeItemId:
        acqType === 'ah' && Number.isFinite(parsedScrollId) && parsedScrollId > 0
          ? parsedScrollId
          : undefined,
      recipeScrollName:
        acqType === 'ah' && Number.isFinite(parsedScrollId) && parsedScrollId > 0
          ? `Recipe: ${trimmedName}`
          : undefined,
      acquisition: {
        type: acqType,
        sourceLabel: sourceLabel.trim() || 'Custom Recipe',
        location: location.trim() || 'Azeroth',
        fixedCostCopper,
      },
      isCustom: true,
    };

    const hasCustomOutputPrice =
      customOutputPriceGold.trim() !== '' || customOutputPriceSilver.trim() !== '';
    const initialOutputOverride = hasCustomOutputPrice
      ? toCopper(Number(customOutputPriceGold), Number(customOutputPriceSilver), 0)
      : undefined;

    onCreate(recipe, initialOutputOverride);
    setName('');
    setCustomOutputPriceGold('');
    setCustomOutputPriceSilver('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-xs sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-recipe-title"
    >
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#24342c] bg-[#111915] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              Apothecary Grimoire
            </p>
            <h2 id="custom-recipe-title" className="text-base font-semibold text-[#e7ece8]">
              Add Custom Recipe
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8fa196] transition hover:bg-[#1c2822] hover:text-[#e7ece8]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#a3b5aa]">Recipe Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Custom Raid Bundle or Elixir"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2 text-sm text-[#e7ece8] placeholder:text-[#55685d] focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#a3b5aa]">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                className="w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-2.5 py-2 text-xs text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#a3b5aa]">Skill (1-300)</span>
              <input
                type="number"
                min={1}
                max={300}
                value={skillRequired}
                onChange={(e) => setSkillRequired(e.target.value)}
                className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2 text-xs text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#a3b5aa]">Craft Yield</span>
              <input
                type="number"
                min={1}
                max={50}
                value={craftYield}
                onChange={(e) => setCraftYield(e.target.value)}
                className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-3 py-2 text-xs text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#a3b5aa]">
                Output Item (Catalog or WoW ID)
              </span>
              <select
                value={outputItemId}
                onChange={(e) => setOutputItemId(e.target.value)}
                className="w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-2.5 py-2 text-xs text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
              >
                {ingredientOptions.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.name} (#{item.itemId})
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span className="mb-1 block text-xs font-medium text-[#a3b5aa]">
                Optional Unit Sell Override (g / s)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  min={0}
                  placeholder="0g"
                  value={customOutputPriceGold}
                  onChange={(e) => setCustomOutputPriceGold(e.target.value)}
                  className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-2.5 py-2 text-xs text-[#e7ece8] placeholder:text-[#55685d] focus:border-emerald-500/60 focus:outline-none"
                />
                <input
                  type="number"
                  min={0}
                  max={99}
                  placeholder="0s"
                  value={customOutputPriceSilver}
                  onChange={(e) => setCustomOutputPriceSilver(e.target.value)}
                  className="font-tabular w-full rounded-xl border border-[#26372e] bg-[#0b110e] px-2.5 py-2 text-xs text-[#e7ece8] placeholder:text-[#55685d] focus:border-emerald-500/60 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="rounded-xl border border-[#1e2c25] bg-[#0b110e] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[#c9d6ce]">Ingredients</span>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 rounded-lg bg-[#192620] px-2 py-1 text-[11px] font-medium text-emerald-400 transition hover:bg-[#22342c]"
              >
                <Plus className="h-3 w-3" />
                Add Mat
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={ing.itemId}
                    onChange={(e) =>
                      handleUpdateIngredient(idx, { itemId: Number(e.target.value) })
                    }
                    className="min-w-0 flex-1 rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8] focus:border-emerald-500/60 focus:outline-none"
                  >
                    {ingredientOptions.map((item) => (
                      <option key={item.itemId} value={item.itemId}>
                        {item.name}
                        {item.vendorPrice ? ' (Vendor)' : ''}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={ing.qty}
                    onChange={(e) =>
                      handleUpdateIngredient(idx, { qty: Number(e.target.value) })
                    }
                    className="font-tabular w-16 rounded-lg border border-[#26372e] bg-[#111915] px-2 py-1.5 text-center text-xs text-[#e7ece8]"
                    aria-label="Ingredient quantity"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="rounded-lg p-1.5 text-[#708578] hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Acquisition */}
          <div className="rounded-xl border border-[#1e2c25] bg-[#0b110e] p-3 space-y-2.5">
            <span className="block text-xs font-medium text-[#c9d6ce]">
              Recipe Acquisition &amp; Cost
            </span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={acqType}
                onChange={(e) => setAcqType(e.target.value as AcquisitionType)}
                className="rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
              >
                {ACQUISITION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Zone / Vendor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
              />
            </div>
            <input
              type="text"
              placeholder="NPC / Drop / Quest source"
              value={sourceLabel}
              onChange={(e) => setSourceLabel(e.target.value)}
              className="w-full rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
            />
            {acqType === 'ah' ? (
              <input
                type="number"
                placeholder="Optional AH Recipe Scroll Item ID (e.g. 13491)"
                value={recipeScrollId}
                onChange={(e) => setRecipeScrollId(e.target.value)}
                className="font-tabular w-full rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
              />
            ) : acqType !== 'quest' ? (
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-0.5 block text-[11px] text-[#eab308]">Recipe Gold</span>
                  <input
                    type="number"
                    min={0}
                    value={recipeCostGold}
                    onChange={(e) => setRecipeCostGold(e.target.value)}
                    className="font-tabular w-full rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
                  />
                </label>
                <label className="block">
                  <span className="mb-0.5 block text-[11px] text-[#cbd5e1]">Recipe Silver</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={recipeCostSilver}
                    onChange={(e) => setRecipeCostSilver(e.target.value)}
                    className="font-tabular w-full rounded-lg border border-[#26372e] bg-[#111915] px-2.5 py-1.5 text-xs text-[#e7ece8]"
                  />
                </label>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#05140d] transition hover:bg-emerald-400"
          >
            Save Custom Recipe
          </button>
        </form>
      </div>
    </div>
  );
}
