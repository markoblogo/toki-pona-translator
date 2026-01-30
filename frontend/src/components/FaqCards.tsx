type FAQ = {
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
  {
    q: 'How accurate is this translator?',
    a: "It uses Google Gemini to generate Toki Pona translations. Great for experimentation and learning, but not official or guaranteed-perfect. Feel free to tweak the output.",
  },
  {
    q: 'Which languages can I type in?',
    a: 'Most major languages. The app auto-detects the input language and translates the meaning into Toki Pona.',
  },
  {
    q: 'Is this really free to use?',
    a: 'Yes. No accounts, logins, or ads — just the translator and learning links.',
  },
];

export default function FaqCards() {
  return (
    <section className="max-w-5xl mx-auto mt-16 mb-12 px-4">
      <h3 className="text-2xl font-bold text-[#111827] mb-8 text-center">FAQ</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map((f) => (
          <div key={f.q} className="card-gloss p-6">
            <h4 className="text-base font-semibold text-[#111827]">{f.q}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[#9CA3AF]">
        Tip: Switch output modes — Latin, sitelen pona, or Emoji — to explore the same meaning in different scripts.
      </p>
    </section>
  );
}
