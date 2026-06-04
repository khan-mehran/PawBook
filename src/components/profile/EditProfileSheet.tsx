import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Check, MapPin, Tag, FileText, User, AlertCircle } from 'lucide-react';
import type { Pet } from '../../data/dummyData';

/* ── Constants ───────────────────────────────── */
const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Reptile', 'Other'] as const;
const SPECIES_EMOJI: Record<string, string> = {
  Dog: '🐶', Cat: '🐱', Bird: '🦜', Rabbit: '🐰',
  Hamster: '🐹', Reptile: '🦎', Other: '🐾',
};
const ALL_TAGS = [
  'Playful', 'Lazy', 'Foodie', 'Explorer', 'Cuddly',
  'Energetic', 'Shy', 'Social', 'Elegant', 'Mischievous',
  'Loyal', 'Active', 'Smart', 'Fluffy', 'Fashionable',
];
const AGE_OPTIONS = ['Puppy/Kitten', '1 year', '2 years', '3 years', '4 years', '5 years', '6+ years', 'Senior'];

/* ── Photo picker ────────────────────────────── */
const PhotoPicker: React.FC<{
  src: string;
  label: string;
  aspect: 'square' | 'wide';
  onChangeSrc: (url: string) => void;
}> = ({ src, label, aspect, onChangeSrc }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(src);

  const handleApply = () => {
    onChangeSrc(draft.trim() || src);
    setEditing(false);
  };

  return (
    <div className="relative group">
      <div
        className={`w-full overflow-hidden rounded-2xl bg-[var(--pb-surface)] ${
          aspect === 'square' ? 'aspect-square' : 'aspect-[4/1]'
        }`}
      >
        <img src={src} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-medium cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            {label}
          </button>
        </div>
      </div>

      {/* URL input overlay */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-2xl p-4 flex flex-col gap-3 z-10"
          >
            <p className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider">
              {label} — paste an image URL
            </p>
            <input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="https://images.unsplash.com/…"
              autoFocus
              className="flex-1 bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-3 py-2 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-xl bg-[var(--pb-hover)] border border-[var(--pb-border)] text-sm text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white text-sm font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Field wrapper ───────────────────────────── */
const Field: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ icon, label, children, hint }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider mb-2">
      {icon}
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-[var(--pb-muted)] mt-1">{hint}</p>}
  </div>
);

/* ── Main component ──────────────────────────── */
interface EditProfileSheetProps {
  pet: Pet;
  onClose: () => void;
  onSave: (updates: Partial<Pet>) => void;
}

const EditProfileSheet: React.FC<EditProfileSheetProps> = ({ pet, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:         pet.name,
    bio:          pet.bio,
    breed:        pet.breed,
    age:          pet.age,
    location:     pet.location,
    species:      pet.species,
    tags:         [...pet.tags],
    profileImage: pet.profileImage,
    coverImage:   pet.coverImage,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const upd = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const toggleTag = (tag: string) =>
    setForm((p) => ({
      ...p,
      tags: p.tags.includes(tag)
        ? p.tags.filter((t) => t !== tag)
        : p.tags.length >= 5 ? p.tags : [...p.tags, tag],
    }));

  const handleSave = () => {
    if (!form.name.trim()) { setError('Pet name cannot be empty.'); return; }
    setError('');
    onSave({ ...form });
    setSaved(true);
    setTimeout(onClose, 900);
  };

  const inputCls =
    'w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-sm text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/60 transition-colors';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[92vh] bg-[var(--pb-card)] border border-[var(--pb-border)] rounded-3xl flex flex-col overflow-hidden"
      >
        {/* ── Sticky header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pb-border-faint)] flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--pb-hover)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="font-display font-bold text-base text-[var(--pb-text)]">Edit Profile</h2>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-full px-4 py-1.5 text-sm font-bold disabled:opacity-70 cursor-pointer hover:shadow-[0_0_16px_rgba(124,58,237,0.4)] transition-shadow"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save'}
          </motion.button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Photos */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-[var(--pb-muted)] uppercase tracking-wider">Photos</p>
            <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
              {/* Profile photo */}
              <PhotoPicker
                src={form.profileImage}
                label="Profile"
                aspect="square"
                onChangeSrc={(url) => upd('profileImage', url)}
              />
              {/* Cover photo */}
              <PhotoPicker
                src={form.coverImage}
                label="Cover"
                aspect="wide"
                onChangeSrc={(url) => upd('coverImage', url)}
              />
            </div>
            <p className="text-[10px] text-[var(--pb-muted)]">
              Hover a photo and click "Change" to update. Paste any image URL (e.g. from Unsplash).
            </p>
          </div>

          {/* Name */}
          <Field icon={<User className="w-3.5 h-3.5" />} label="Pet Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => upd('name', e.target.value)}
              placeholder="Your pet's name"
              className={inputCls}
            />
          </Field>

          {/* Bio */}
          <Field
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Bio"
            hint={`${form.bio.length}/280 characters`}
          >
            <textarea
              value={form.bio}
              onChange={(e) => upd('bio', e.target.value.slice(0, 280))}
              placeholder="Tell the world about your pet's personality & quirks 🐾"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Species */}
          <Field icon={<span className="text-xs">🐾</span>} label="Species">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {SPECIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => upd('species', s)}
                  className={`
                    flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
                    ${form.species === s
                      ? 'bg-gradient-to-br from-orange-500 to-violet-600 text-white shadow-md scale-105'
                      : 'bg-[var(--pb-hover)] border border-[var(--pb-border)] text-[var(--pb-muted)] hover:border-orange-500/30 hover:text-[var(--pb-text)]'
                    }
                  `}
                >
                  <span className="text-xl">{SPECIES_EMOJI[s]}</span>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Breed + Age row */}
          <div className="grid grid-cols-2 gap-4">
            <Field icon={<User className="w-3.5 h-3.5" />} label="Breed">
              <input
                type="text"
                value={form.breed}
                onChange={(e) => upd('breed', e.target.value)}
                placeholder="e.g. Golden Retriever"
                className={inputCls}
              />
            </Field>
            <Field icon={<User className="w-3.5 h-3.5" />} label="Age">
              <select
                value={form.age}
                onChange={(e) => upd('age', e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Location */}
          <Field icon={<MapPin className="w-3.5 h-3.5" />} label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => upd('location', e.target.value)}
              placeholder="e.g. New York, USA"
              className={inputCls}
            />
          </Field>

          {/* Personality tags */}
          <Field
            icon={<Tag className="w-3.5 h-3.5" />}
            label="Personality Tags"
            hint={`${form.tags.length}/5 selected`}
          >
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const active = form.tags.includes(tag);
                const maxed  = !active && form.tags.length >= 5;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    disabled={maxed}
                    className={`
                      text-xs rounded-full px-3 py-1.5 transition-all cursor-pointer disabled:opacity-40
                      ${active
                        ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white font-semibold'
                        : 'bg-[var(--pb-hover)] border border-[var(--pb-border)] text-[var(--pb-muted)] hover:border-orange-500/30 hover:text-[var(--pb-text)]'
                      }
                    `}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <p className="text-xs text-rose-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom save button (also reachable without scrolling up) */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saved}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold text-sm cursor-pointer disabled:opacity-70 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-shadow mb-2"
          >
            {saved ? '✓ Changes Saved!' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileSheet;
