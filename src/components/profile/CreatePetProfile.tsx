import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Camera } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Reptile', 'Other'];
const PERSONALITY_TAGS = ['Playful', 'Lazy', 'Foodie', 'Explorer', 'Cuddly', 'Energetic', 'Shy', 'Social', 'Elegant', 'Mischievous'];

const STEPS = ['Basic Info', 'Photos', 'Bio & Tags', 'Privacy', 'Preview'];

const CreatePetProfile: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '1',
    bio: '',
    location: '',
    tags: [] as string[],
    profileImage: '',
    coverImage: '',
  });
  const [completed, setCompleted] = useState(false);

  const update = (key: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag].slice(0, 5),
    }));
  };

  const handleFinish = () => {
    setCompleted(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-7xl"
        >
          🐾
        </motion.div>
        <div>
          <h2 className="font-display font-black text-3xl text-[var(--pb-text)] mb-2">Profile Created!</h2>
          <p className="text-[var(--pb-muted)]">Redirecting to your feed...</p>
        </div>
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [-10, 10, -10], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              className="text-2xl"
            >
              🎉
            </motion.span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-[var(--pb-text)] mb-1">Create Pet Profile</h1>
        <p className="text-[var(--pb-muted)] text-sm">Share your pet's story with the world 🐾</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${i < step ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white'
                    : i === step ? 'bg-orange-500 text-white ring-4 ring-orange-500/30'
                    : 'bg-[var(--pb-hover)] text-[var(--pb-muted)]'}
                `}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] hidden sm:block ${i === step ? 'text-orange-400' : 'text-[var(--pb-muted)]'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-[var(--pb-hover)] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-orange-500 to-violet-600 rounded-full"
          />
        </div>
      </div>

      {/* Step content */}
      <GlassCard className="p-6 sm:p-8" hover={false}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 1: Basic Info */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display font-bold text-xl text-[var(--pb-text)]">Basic Info</h2>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Pet Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g. Mango, Luna, Biscuit"
                    className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Species *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SPECIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => update('species', s)}
                        className={`
                          py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                          ${form.species === s
                            ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white'
                            : 'bg-[var(--pb-hover)] border border-[var(--pb-border)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:border-orange-500/30'}
                        `}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Breed</label>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => update('breed', e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display font-bold text-xl text-[var(--pb-text)]">Add Photos</h2>
                <div
                  className="h-40 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500/50 transition-colors group"
                  onClick={() => update('profileImage', `https://images.unsplash.com/photo-${Date.now()}?w=400`)}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500/20 to-violet-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--pb-text)]">Upload Profile Photo</p>
                    <p className="text-xs text-[var(--pb-muted)]">JPG, PNG up to 10MB</p>
                  </div>
                </div>
                <div
                  className="h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-500/50 transition-colors group"
                  onClick={() => update('coverImage', `https://images.unsplash.com/photo-${Date.now()}?w=800`)}
                >
                  <Camera className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--pb-text)]">Upload Cover Photo</p>
                    <p className="text-xs text-[var(--pb-muted)]">Wide banner image</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bio */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display font-bold text-xl text-[var(--pb-text)]">Bio & Personality</h2>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    maxLength={280}
                    rows={4}
                    placeholder="Tell the world about your pet's personality, hobbies and quirks... 🐾"
                    className="w-full bg-[var(--pb-hover)] border border-[var(--pb-border)] rounded-xl px-4 py-3 text-[var(--pb-text)] placeholder-[var(--pb-muted)] focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                  />
                  <p className="text-xs text-[var(--pb-muted)] mt-1 text-right">{form.bio.length}/280</p>
                </div>
                <div>
                  <label className="text-sm text-[var(--pb-muted)] mb-2 block">Personality Tags (choose up to 5)</label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALITY_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`
                          text-sm rounded-full px-4 py-1.5 transition-all cursor-pointer
                          ${form.tags.includes(tag)
                            ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white'
                            : 'bg-[var(--pb-hover)] border border-[var(--pb-border)] text-[var(--pb-muted)] hover:text-[var(--pb-text)] hover:border-orange-500/30'}
                        `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Privacy */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display font-bold text-xl text-[var(--pb-text)]">Privacy Settings</h2>
                {[
                  { title: 'Public Profile', desc: 'Anyone can view your pet\'s profile', default: true },
                  { title: 'Allow Friend Requests', desc: 'Other pets can send you friend requests', default: true },
                  { title: 'Show Location', desc: 'Display your city on the profile', default: true },
                  { title: 'Tag in Posts', desc: 'Allow others to tag your pet in posts', default: false },
                ].map(({ title, desc, default: checked }) => (
                  <div key={title} className="flex items-center justify-between p-4 bg-[var(--pb-hover)] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[var(--pb-text)]">{title}</p>
                      <p className="text-xs text-[var(--pb-muted)]">{desc}</p>
                    </div>
                    <div
                      className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${checked ? 'bg-gradient-to-r from-orange-500 to-violet-600' : 'bg-white/10'}`}
                    >
                      <motion.div
                        animate={{ x: checked ? 20 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Preview */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display font-bold text-xl text-[var(--pb-text)]">Preview & Publish</h2>
                <div className="bg-gradient-to-br from-orange-500/10 to-violet-600/10 border border-orange-500/20 rounded-2xl p-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-violet-600 mx-auto mb-3 flex items-center justify-center text-4xl">
                    🐾
                  </div>
                  <h3 className="font-display font-black text-2xl text-[var(--pb-text)]">{form.name || 'Your Pet'}</h3>
                  <p className="text-[var(--pb-muted)] text-sm">{form.breed} · {form.species}</p>
                  <p className="text-[var(--pb-muted)] text-xs mt-1">{form.location}</p>
                  {form.bio && <p className="text-sm text-[var(--pb-text)] mt-3 leading-relaxed">{form.bio}</p>}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {form.tags.map((t) => (
                      <span key={t} className="text-xs bg-orange-500/20 text-orange-400 rounded-full px-3 py-1">{t}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--pb-muted)] text-center">
                  Your profile will be visible to the PawBook community 🌍
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <GradientButton
            variant="ghost"
            onClick={() => setStep((p) => Math.max(0, p - 1))}
            disabled={step === 0}
          >
            <span className="flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" /> Back
            </span>
          </GradientButton>

          {step < STEPS.length - 1 ? (
            <GradientButton
              variant="primary"
              onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))}
            >
              <span className="flex items-center gap-1.5">
                Continue <ChevronRight className="w-4 h-4" />
              </span>
            </GradientButton>
          ) : (
            <GradientButton variant="primary" onClick={handleFinish}>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Publish Profile
              </span>
            </GradientButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default CreatePetProfile;
