import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, BookOpen, Feather, Microscope } from 'lucide-react'

const FEATURES = [
  {
    icon: Feather,
    title: 'Guided Composition',
    description:
      'Move from raw idea to finished draft through a structured workflow — idea, form, style, and generation.',
  },
  {
    icon: BookOpen,
    title: 'Ten Poetic Forms',
    description:
      'Free verse to villanelle. Each form explained with structure, tradition, and craft guidance before you choose.',
  },
  {
    icon: Microscope,
    title: 'Craft Analysis',
    description:
      'After every draft, see which devices appear, where the language leans abstract, and where the poem could sharpen.',
  },
]

const PROCESS_STEPS = [
  { number: '01', label: 'Idea', description: 'Name the topic, the image, the feeling.' },
  { number: '02', label: 'Form', description: 'Choose the vessel — each one changes what the poem can hold.' },
  { number: '03', label: 'Style', description: 'Set the pressure: diction, density, voice, and length.' },
  { number: '04', label: 'Draft', description: 'Generate the first version. Then shape it.' },
  { number: '05', label: 'Revise', description: 'Strengthen, darken, restrain, open — on your terms.' },
  { number: '06', label: 'Analyse', description: 'See what the poem is doing and where it could go further.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary font-serif text-lg font-semibold tracking-tight">
            Geneviève
          </span>
          <span className="text-muted-foreground/40 text-sm">Poetry Engine</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/forms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Forms Library
          </Link>
          <Link href="/studio">
            <Button size="sm" className="text-xs">
              Begin composing
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium">
              A composition instrument
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight">
              Geneviève
              <span className="block text-primary/80">Poetry Engine</span>
            </h1>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            From raw idea to finished poem — through a structured workflow that teaches form,
            builds a composition prompt, and helps you revise with intention.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link href="/studio">
              <Button size="lg" className="px-8">
                Begin with an image
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/forms">
              <Button variant="outline" size="lg" className="px-8">
                Explore forms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto w-full opacity-30" />

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="space-y-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-primary/70" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto w-full opacity-30" />

      {/* Process */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 mb-8 text-center">
            The Process
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-primary/50 font-mono">{step.number}</span>
                  <span className="text-sm font-semibold text-foreground">{step.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 px-6 py-6 mt-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground/40">Geneviève Poetry Engine</span>
          <span className="text-xs text-muted-foreground/30 italic">
            "Begin with an image."
          </span>
        </div>
      </footer>
    </div>
  )
}
