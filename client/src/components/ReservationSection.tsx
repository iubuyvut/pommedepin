import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/* ── helpers ── */
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function isClosed(date: Date) {
  return date.getDay() === 1; // lundi fermé
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getTimeSlots(date: Date | null) {
  if (!date) return [];
  const day = date.getDay();
  const isFriSat = day === 5 || day === 6;
  const slots: string[] = [];
  const start = 19;
  const end = isFriSat ? 22 : 21;
  for (let h = start; h <= end; h++) {
    slots.push(`${h}:00`);
    if (h < end || (h === end && !isFriSat)) {
      slots.push(`${h}:30`);
    }
  }
  return slots;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // lundi = 0
}

/* ── types ── */
interface FormData {
  date: Date | null;
  time: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

type Step = "datetime" | "details" | "confirm";

/* ── component ── */
export default function ReservationSection() {
  const { ref, isVisible } = useScrollReveal(0.05);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const [form, setForm] = useState<FormData>({
    date: null,
    time: "",
    guests: 2,
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [step, setStep] = useState<Step>("datetime");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* calendar data */
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(calYear, calMonth, d));
    }
    return cells;
  }, [calYear, calMonth]);

  const timeSlots = getTimeSlots(form.date);

  /* navigation */
  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  }

  /* validation */
  function validateStep1() {
    const e: Record<string, string> = {};
    if (!form.date) e.date = "Veuillez choisir une date";
    if (!form.time) e.time = "Veuillez choisir un créneau";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function validateStep2() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.phone.trim()) e.phone = "Requis";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === "datetime" && validateStep1()) setStep("details");
    else if (step === "details" && validateStep2()) setStep("confirm");
  }

  function handleBack() {
    setErrors({});
    if (step === "details") setStep("datetime");
    else if (step === "confirm") setStep("details");
  }

  const createReservation = trpc.reservations.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      if (!form.date) throw new Error("Date not selected");
      
      const dateStr = `${form.date.getFullYear()}-${String(form.date.getMonth() + 1).padStart(2, '0')}-${String(form.date.getDate()).padStart(2, '0')}`;
      
      await createReservation.mutateAsync({
        date: dateStr,
        time: form.time,
        guests: form.guests,
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes || undefined,
      });
      
      toast.success("Réservation confirmée ! Un e-mail de confirmation vous a été envoyé.");
      setSubmitted(true);
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Erreur lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setForm({ date: null, time: "", guests: 2, name: "", phone: "", email: "", notes: "" });
    setStep("datetime");
    setSubmitted(false);
    setErrors({});
  }

  const selectedDateStr = form.date
    ? `${DAYS_FR[form.date.getDay()]} ${form.date.getDate()} ${MONTHS_FR[form.date.getMonth()]} ${form.date.getFullYear()}`
    : "";

  /* ── render ── */
  return (
    <section id="reservation" className="relative py-24 md:py-32">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div ref={ref} className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span
            className="text-gold text-sm uppercase tracking-[0.2em] mb-4 block"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Réservation
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Cormorant', serif" }}
          >
            Réservez votre <span className="text-gold italic">table</span>
          </h2>
          <p
            className="text-foreground/50 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Choisissez votre date, votre créneau et le nombre de convives. Nous vous attendons avec plaisir.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto rounded-2xl bg-card/60 border border-border/30 backdrop-blur-sm overflow-hidden"
        >
          {/* Progress Bar */}
          {!submitted && (
            <div className="flex border-b border-border/20">
              {(["datetime", "details", "confirm"] as Step[]).map((s, i) => {
                const labels = ["Date & Heure", "Vos Coordonnées", "Confirmation"];
                const icons = [CalendarDays, User, CheckCircle2];
                const Icon = icons[i];
                const isActive = step === s;
                const isDone =
                  (s === "datetime" && (step === "details" || step === "confirm")) ||
                  (s === "details" && step === "confirm");
                return (
                  <div
                    key={s}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-gold border-b-2 border-gold bg-gold/5"
                        : isDone
                        ? "text-gold/60"
                        : "text-foreground/30"
                    }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{labels[i]}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* ── SUCCESS ── */}
              {submitted && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3
                    className="text-3xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    Réservation confirmée !
                  </h3>
                  <p
                    className="text-foreground/50 text-base mb-2 max-w-md mx-auto"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Merci <span className="text-foreground font-medium">{form.name}</span>. Votre table pour{" "}
                    <span className="text-gold font-medium">{form.guests} personne{form.guests > 1 ? "s" : ""}</span> est
                    réservée le :
                  </p>
                  <p
                    className="text-gold text-xl font-semibold mb-1"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {selectedDateStr}
                  </p>
                  <p
                    className="text-gold/80 text-lg mb-8"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    à {form.time}
                  </p>
                  <p
                    className="text-foreground/40 text-sm mb-6"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Un SMS de confirmation vous sera envoyé au {form.phone}.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 border border-gold/40 text-gold rounded-full text-sm font-medium hover:bg-gold/10 transition-all"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Nouvelle réservation
                  </button>
                </motion.div>
              )}

              {/* ── STEP 1: Date & Time ── */}
              {!submitted && step === "datetime" && (
                <motion.div
                  key="datetime"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Calendar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="text-lg font-bold text-foreground flex items-center gap-2"
                        style={{ fontFamily: "'Cormorant', serif" }}
                      >
                        <CalendarDays className="w-5 h-5 text-gold" />
                        Choisissez une date
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevMonth}
                          className="w-8 h-8 rounded-lg bg-card border border-border/30 flex items-center justify-center text-foreground/60 hover:text-gold hover:border-gold/30 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span
                          className="text-foreground text-sm font-medium min-w-[140px] text-center"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {MONTHS_FR[calMonth]} {calYear}
                        </span>
                        <button
                          onClick={nextMonth}
                          className="w-8 h-8 rounded-lg bg-card border border-border/30 flex items-center justify-center text-foreground/60 hover:text-gold hover:border-gold/30 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                        <div
                          key={d}
                          className="text-center text-xs text-foreground/30 py-2 font-medium"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, i) => {
                        if (!date) return <div key={`empty-${i}`} />;
                        const closed = isClosed(date);
                        const past = isPast(date);
                        const disabled = closed || past;
                        const todayMark = isToday(date);
                        const selected =
                          form.date &&
                          date.getDate() === form.date.getDate() &&
                          date.getMonth() === form.date.getMonth() &&
                          date.getFullYear() === form.date.getFullYear();

                        return (
                          <button
                            key={date.toISOString()}
                            disabled={disabled}
                            onClick={() => {
                              setForm({ ...form, date, time: "" });
                              setErrors({ ...errors, date: "" });
                            }}
                            className={`relative h-10 rounded-lg text-sm font-medium transition-all ${
                              selected
                                ? "bg-gold text-background shadow-[0_0_12px_rgba(201,169,110,0.3)]"
                                : disabled
                                ? "text-foreground/15 cursor-not-allowed"
                                : todayMark
                                ? "bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20"
                                : "text-foreground/70 hover:bg-card hover:text-foreground border border-transparent hover:border-border/30"
                            }`}
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                          >
                            {date.getDate()}
                            {closed && !past && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400/60" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-foreground/30" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400/60" /> Fermé (lundi)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gold/40" /> Aujourd'hui
                      </span>
                    </div>

                    {errors.date && (
                      <p className="text-red-400 text-xs mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Slots */}
                  {form.date && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <h4
                        className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"
                        style={{ fontFamily: "'Cormorant', serif" }}
                      >
                        <Clock className="w-5 h-5 text-gold" />
                        Choisissez un créneau — {selectedDateStr}
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => {
                              setForm({ ...form, time: slot });
                              setErrors({ ...errors, time: "" });
                            }}
                            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                              form.time === slot
                                ? "bg-gold text-background shadow-[0_0_12px_rgba(201,169,110,0.3)]"
                                : "bg-card/50 border border-border/20 text-foreground/60 hover:border-gold/30 hover:text-foreground"
                            }`}
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {errors.time && (
                        <p className="text-red-400 text-xs mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {errors.time}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Guests */}
                  <div className="mb-8">
                    <h4
                      className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      <Users className="w-5 h-5 text-gold" />
                      Nombre de convives
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <button
                          key={n}
                          onClick={() => setForm({ ...form, guests: n })}
                          className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all ${
                            form.guests === n
                              ? "bg-gold text-background shadow-[0_0_12px_rgba(201,169,110,0.3)]"
                              : "bg-card/50 border border-border/20 text-foreground/60 hover:border-gold/30 hover:text-foreground"
                          }`}
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => setForm({ ...form, guests: 10 })}
                        className={`px-4 h-12 rounded-lg text-sm font-semibold transition-all ${
                          form.guests >= 9
                            ? "bg-gold text-background shadow-[0_0_12px_rgba(201,169,110,0.3)]"
                            : "bg-card/50 border border-border/20 text-foreground/60 hover:border-gold/30 hover:text-foreground"
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        9+
                      </button>
                    </div>
                  </div>

                  {/* Next */}
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gold text-background rounded-xl text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Continuer
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2: Details ── */}
              {!submitted && step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary pill */}
                  <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-xl bg-gold/5 border border-gold/20">
                    <span className="flex items-center gap-1.5 text-sm text-gold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <CalendarDays className="w-4 h-4" />
                      {selectedDateStr}
                    </span>
                    <span className="text-foreground/20">·</span>
                    <span className="flex items-center gap-1.5 text-sm text-gold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <Clock className="w-4 h-4" />
                      {form.time}
                    </span>
                    <span className="text-foreground/20">·</span>
                    <span className="flex items-center gap-1.5 text-sm text-gold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <Users className="w-4 h-4" />
                      {form.guests} pers.
                    </span>
                    <button
                      onClick={handleBack}
                      className="ml-auto text-foreground/40 hover:text-gold transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="text-foreground/60 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <User className="w-4 h-4 text-gold/60" /> Nom complet *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          setErrors({ ...errors, name: "" });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                        placeholder="Jean Dupont"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-foreground/60 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <Phone className="w-4 h-4 text-gold/60" /> Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          setErrors({ ...errors, phone: "" });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                        placeholder="0470 12 34 56"
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-foreground/60 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <Mail className="w-4 h-4 text-gold/60" /> Email (optionnel)
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          setErrors({ ...errors, email: "" });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                        placeholder="jean@exemple.be"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-foreground/60 text-sm mb-2 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <MessageSquare className="w-4 h-4 text-gold/60" /> Remarques (optionnel)
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-foreground/20 focus:border-gold/50 focus:outline-none transition-colors resize-none"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                        placeholder="Allergies, anniversaire, chaise haute..."
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-4 border border-border/30 text-foreground/60 rounded-xl text-base font-medium hover:border-gold/30 hover:text-foreground transition-all"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-[2] py-4 bg-gold text-background rounded-xl text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Vérifier la réservation
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Confirm ── */}
              {!submitted && step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3
                    className="text-2xl font-bold text-foreground mb-6"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    Récapitulatif de votre réservation
                  </h3>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: CalendarDays, label: "Date", value: selectedDateStr },
                      { icon: Clock, label: "Heure", value: form.time },
                      { icon: Users, label: "Convives", value: `${form.guests} personne${form.guests > 1 ? "s" : ""}` },
                      { icon: User, label: "Nom", value: form.name },
                      { icon: Phone, label: "Téléphone", value: form.phone },
                      ...(form.email ? [{ icon: Mail, label: "Email", value: form.email }] : []),
                      ...(form.notes ? [{ icon: MessageSquare, label: "Remarques", value: form.notes }] : []),
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/15"
                      >
                        <item.icon className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                        <div>
                          <p className="text-foreground/40 text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {item.label}
                          </p>
                          <p className="text-foreground text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 py-4 border border-border/30 text-foreground/60 rounded-xl text-base font-medium hover:border-gold/30 hover:text-foreground transition-all"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-[2] py-4 bg-gold text-background rounded-xl text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Confirmer la réservation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center text-foreground/30 text-sm mt-8 max-w-lg mx-auto"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Pour les groupes de plus de 10 personnes, veuillez nous contacter directement au{" "}
          <span className="text-gold">02 374 27 36</span>.
        </motion.p>
      </div>
    </section>
  );
}
