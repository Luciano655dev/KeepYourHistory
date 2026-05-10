"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";

import { FallingPapers } from "./components/falling-papers";

const projectHighlights = [
  "Storytelling",
  "Interviews",
  "Website Design",
  "Bilingual Cards",
  "Memory Boxes",
  "Fundraising",
  "Community Support",
  "Service",
];

const journeyStages = [
  {
    label: "Investigation",
    title: "Listening to the community first",
    description:
      "We reconnected with a Catholic church community in Brazil and discovered two needs at once: older women whose life lessons deserved to be heard, and local outreach efforts supporting homeless people and vulnerable families.",
  },
  {
    label: "Preparation",
    title: "Adapting the idea without losing the purpose",
    description:
      "Our original plan focused on full biographies and books. After reviewing time, logistics, and remote coordination, we redesigned the project into a more realistic format built around interviews, translated messages, cards, boxes, and a website.",
  },
  {
    label: "Action",
    title: "Interviews, design, fundraising, and coordination",
    description:
      "We interviewed elderly women, translated their reflections into Portuguese and English, designed inspirational cards and memory boxes, developed the website, and coordinated fundraising and donation efforts with the church volunteers.",
  },
  {
    label: "Challenges",
    title: "Working across distance and constraints",
    description:
      "A major challenge was coordinating much of the project remotely from the United States while depending on trusted volunteers in Brazil for local communication, delivery, and distribution. That forced us to be organized, flexible, and practical.",
  },
  {
    label: "Learning Outcomes",
    title: "Connecting memory with global significance",
    description:
      "The project deepened our understanding of intergenerational connection, loneliness among elderly people, food insecurity, homelessness, empathy, and the value of preserving overlooked stories across cultures and communities.",
  },
];

const impactCards = [
  {
    title: "Interviews and reflections",
    description:
      "We listened to elderly women from the church community and documented their advice about faith, family, resilience, regret, happiness, and personal growth.",
  },
  {
    title: "Bilingual message cards",
    description:
      "Their words were organized and translated into Portuguese and English so the lessons could be shared more widely across generations.",
  },
  {
    title: "Memory boxes",
    description:
      "We designed physical boxes to preserve the cards in a meaningful way, turning short messages into something personal that people can revisit over time.",
  },
  {
    title: "Donation support",
    description:
      "Funds raised through the project were used to support food, hygiene products, household supplies, and other essentials for people assisted by the church community.",
  },
];

const learningOutcomes = [
  "Preserving memories and personal histories",
  "Intergenerational communication",
  "Loneliness and invisibility among elderly people",
  "Homelessness and food insecurity",
  "Empathy, adaptability, and collaboration",
  "Stronger connection between Brazil and the United States",
];

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      organizationName: String(formData.get("organizationName") ?? "").trim(),
      contactName: String(formData.get("contactName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setRequestSubmitted(false);
    setRequestError(null);
    setIsRequestSubmitting(true);

    try {
      const response = await fetch("/api/request-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to send your message right now.");
      }

      setRequestSubmitted(true);
      form.reset();
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now.",
      );
    } finally {
      setIsRequestSubmitting(false);
    }
  };

  const handleRequestChange = () => {
    if (requestSubmitted) {
      setRequestSubmitted(false);
    }
    if (requestError) {
      setRequestError(null);
    }
  };

  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]"),
    );

    if (animatedElements.length === 0) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      for (const element of animatedElements) {
        window.requestAnimationFrame(() => {
          element.classList.add("is-visible");
        });
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const element = entry.target as HTMLElement;
          window.requestAnimationFrame(() => {
            element.classList.add("is-visible");
          });
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    for (const element of animatedElements) {
      const rawDelay = Number(element.dataset.animateDelay ?? "0");
      const delay = Number.isFinite(rawDelay) ? Math.max(rawDelay, 0) : 0;
      element.style.setProperty("--reveal-delay", `${delay}ms`);

      if (element.classList.contains("is-visible")) {
        continue;
      }

      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(145,174,192,0.32),transparent_42%),radial-gradient(circle_at_50%_72%,rgba(169,194,208,0.3),transparent_38%),linear-gradient(180deg,#f4f8fa_0%,#edf4f7_42%,#e6eff3_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(247,251,253,0.94),rgba(247,251,253,0))]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(230,239,244,0),rgba(216,229,237,0.48))]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <FallingPapers />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 w-full border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/90 shadow-[0_18px_50px_-38px_rgba(46,70,84,0.32)] backdrop-blur transition-all duration-300 ${
          showHeader
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <a href="#" className="flex items-center gap-3">
            <span className="font-display text-[1.2rem] font-semibold leading-none text-[color:var(--color-accent)] sm:text-[1.35rem]">
              Keep Your History
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-[color:var(--color-muted)] md:flex">
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#project"
            >
              Project
            </a>
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#journey"
            >
              Journey
            </a>
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#impact"
            >
              Impact
            </a>
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#contact"
            >
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-accent-soft)] px-4 py-2 text-[0.73rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground)] shadow-[0_10px_24px_-18px_rgba(43,67,83,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(214,228,236,0.96)] sm:px-5 sm:py-2.5"
          >
            Contact
          </a>
        </div>
      </header>

      <section
        data-animate
        className="reveal reveal-up relative mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 text-center sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-28 lg:text-left"
      >
        <div className="pointer-events-none absolute left-1/2 top-[10%] z-[2] h-32 w-[min(34rem,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,251,253,0.92),rgba(246,251,253,0.5)_44%,transparent_74%)] blur-2xl sm:h-40 sm:w-[min(48rem,88vw)] lg:top-[15%] lg:h-44 lg:w-[min(58rem,88vw)]" />
        <div className="pointer-events-none absolute left-1/2 top-[56%] z-[2] h-52 w-[min(38rem,94vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,248,251,0.84),rgba(241,248,251,0.28)_46%,transparent_72%)] blur-3xl sm:h-72 sm:w-[min(58rem,92vw)] lg:top-[54%] lg:h-80 lg:w-[min(70rem,96vw)]" />

        <div
          data-animate
          className="reveal reveal-left relative z-10 mx-auto flex w-full max-w-[40rem] flex-col items-center justify-center lg:col-span-6 lg:mx-0 lg:max-w-none lg:items-start"
        >
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            IB CAS Project
          </p>
          <h1 className="mt-4 font-display text-[2.9rem] leading-[0.96] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[4rem] lg:text-[4.9rem] xl:text-[5.45rem]">
            <span className="block font-semibold text-[color:var(--color-accent)]">
              Keep Your History
            </span>
            <span className="mt-2 block font-medium">
              stories, service, and memory across generations.
            </span>
          </h1>

          <div className="mt-6 max-w-[36rem] space-y-4 sm:mt-8 sm:space-y-5">
            <p className="text-[1rem] leading-[1.7] text-[color:var(--color-foreground)] sm:text-[1.12rem] sm:leading-[1.75]">
              For our CAS project, my brother and I worked with a Catholic
              church community in Brazil to preserve life lessons from older
              women while also helping people in vulnerable situations through
              donations and local community support.
            </p>
            <p className="text-[0.95rem] leading-7 text-[color:var(--color-muted)] sm:text-[1.02rem] sm:leading-8">
              What began as a more book-centered idea evolved into something
              more realistic and more human: interviews, bilingual message
              cards, memory boxes, a website, fundraising, and a project that
              connected Brazil and the United States.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex w-full max-w-[32rem] flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center lg:w-auto lg:max-w-none lg:items-start">
            <a
              href="#project"
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-[rgba(74,102,121,0.28)] bg-[rgba(214,228,236,0.9)] px-6 py-3.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-foreground)] shadow-[0_18px_34px_-26px_rgba(45,68,84,0.48)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(214,228,236,1)] hover:shadow-[0_22px_38px_-26px_rgba(45,68,84,0.52)] sm:min-w-[11.5rem] sm:px-7 sm:py-4 sm:text-[0.78rem]"
            >
              Read the Project
            </a>
            <a
              href="#contact"
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-[rgba(84,112,130,0.24)] bg-[rgba(247,251,253,0.86)] px-6 py-3.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_16px_30px_-26px_rgba(45,68,84,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(247,251,253,0.98)] sm:min-w-[11.5rem] sm:px-7 sm:py-4 sm:text-[0.78rem]"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {projectHighlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-[rgba(86,114,132,0.2)] bg-[rgba(247,251,253,0.7)] px-3.5 py-2 text-[0.74rem] font-medium tracking-[0.06em] text-[color:var(--color-muted)] shadow-[0_10px_22px_-18px_rgba(47,71,87,0.4)]"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div
          data-animate
          data-animate-delay="120"
          className="reveal reveal-right relative z-10 mx-auto flex h-[24rem] w-full max-w-[34rem] items-center justify-center sm:h-[28rem] lg:col-span-6 lg:mx-0 lg:h-[40rem] lg:max-w-none lg:justify-end"
        >
          <div className="relative h-full w-full max-w-[31rem] lg:max-w-[35rem]">
            <div className="absolute left-[6%] top-[6%] h-[62%] w-[54%] rotate-[-9deg] rounded-[2rem] border border-[rgba(84,112,130,0.18)] bg-[rgba(245,250,252,0.8)] p-5 shadow-[0_28px_50px_-38px_rgba(45,68,84,0.42)] backdrop-blur">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                Keep Your History
              </p>
              <p className="mt-4 font-display text-[1.6rem] leading-[1.02] text-[color:var(--color-soft-foreground)]">
                Portuguese + English
              </p>
              <div className="mt-5 space-y-2 text-[0.88rem] leading-6 text-[color:var(--color-muted)]">
                <p>Interviews from the church community</p>
                <p>Cards designed from real advice</p>
                <p>Memory boxes for long-term preservation</p>
              </div>
            </div>

            <article className="absolute left-1/2 top-1/2 z-20 w-[72%] max-w-[26rem] -translate-x-1/2 -translate-y-1/2 rotate-[4deg] rounded-[2rem] border border-[rgba(74,102,121,0.22)] bg-[rgba(250,253,255,0.96)] p-6 shadow-[0_32px_64px_-34px_rgba(34,52,65,0.42)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Featured Message
              </p>
              <p className="mt-5 font-display text-[1.85rem] leading-[1.02] text-[color:var(--color-soft-foreground)] sm:text-[2.1rem]">
                Do not let fear stop your opportunities.
              </p>
              <p className="mt-4 text-[0.93rem] leading-7 text-[color:var(--color-muted)]">
                Nao deixe o medo parar suas oportunidades.
              </p>
              <div className="mt-6 border-t border-[rgba(84,112,130,0.16)] pt-4 text-[0.8rem] uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                From interviews with elderly women in Brazil
              </div>
            </article>

            <div className="absolute bottom-[8%] right-[4%] z-30 w-[46%] rounded-[1.4rem] border border-[rgba(86,114,132,0.18)] bg-[rgba(225,237,244,0.9)] p-4 shadow-[0_24px_44px_-34px_rgba(45,68,84,0.4)]">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                Community Support
              </p>
              <p className="mt-3 text-[0.92rem] leading-6 text-[color:var(--color-foreground)]">
                Fundraising helped support food, hygiene products, and other
                essentials for vulnerable families and homeless individuals.
              </p>
            </div>

            <div className="absolute -bottom-2 left-[10%] z-30 hidden h-28 w-28 overflow-hidden rounded-[1.3rem] border border-[rgba(84,112,130,0.18)] bg-[rgba(249,252,254,0.94)] p-1 shadow-[0_20px_38px_-26px_rgba(45,68,84,0.4)] sm:block">
              <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
                <Image
                  src="/WhatsApp Image May 10 2026 (3).jpeg"
                  alt="Keep Your History memory boxes"
                  fill
                  sizes="7rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="project"
        data-animate
        className="reveal reveal-up relative scroll-mt-28 grid w-full items-center gap-10 overflow-hidden px-4 pb-20 pt-8 sm:gap-12 sm:px-8 sm:pb-24 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-24"
      >
        <div className="pointer-events-none absolute left-1/2 top-[22%] z-[1] h-32 w-[min(34rem,86vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,251,253,0.86),rgba(247,251,253,0.2)_62%,transparent)] blur-3xl sm:h-40 sm:w-[min(46rem,82vw)]" />

        <div
          data-animate
          className="reveal reveal-up relative z-10 order-1 mx-auto flex w-full max-w-[34rem] items-center justify-center lg:order-none lg:max-w-none lg:justify-start"
        >
          <div className="relative w-full max-w-[30rem]">
            <div className="absolute -left-4 top-10 hidden rounded-full border border-[rgba(84,112,130,0.16)] bg-[rgba(247,251,253,0.82)] px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-[color:var(--color-muted)] shadow-[0_16px_32px_-24px_rgba(45,68,84,0.4)] sm:block">
              Adapted, not abandoned
            </div>

            <article className="relative rounded-[2.2rem] border border-[rgba(74,102,121,0.2)] bg-[rgba(249,252,254,0.92)] p-6 shadow-[0_36px_64px_-42px_rgba(34,52,65,0.46)] backdrop-blur sm:p-8">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Message Card
              </p>
              <p className="mt-6 font-display text-[2rem] leading-[1.02] text-[color:var(--color-soft-foreground)] sm:text-[2.45rem]">
                Trust God in difficult moments. Value family. Appreciate simple
                things.
              </p>
              <p className="mt-5 text-[1rem] leading-7 text-[color:var(--color-muted)]">
                These reflections shaped the heart of the project and became
                part of the bilingual cards and memory boxes we created.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(236,245,249,0.72)] p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                    Before
                  </p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--color-foreground)]">
                    Full biographies, books, and a larger publishing concept.
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(250,252,254,0.84)] p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                    After
                  </p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--color-foreground)]">
                    Interviews, cards, boxes, a website, and direct community support.
                  </p>
                </div>
              </div>
            </article>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[rgba(84,112,130,0.16)] shadow-[0_20px_38px_-30px_rgba(45,68,84,0.36)]">
                <Image
                  src="/WhatsApp Image May 10 2026.jpeg"
                  alt="Catholic church volunteer community in Brazil"
                  fill
                  sizes="(min-width: 1024px) 15rem, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[rgba(84,112,130,0.16)] shadow-[0_20px_38px_-30px_rgba(45,68,84,0.36)]">
                <Image
                  src="/WhatsApp Image May 10 2026 (3).jpeg"
                  alt="Keep Your History memory boxes prepared for the project"
                  fill
                  sizes="(min-width: 1024px) 15rem, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          data-animate
          data-animate-delay="80"
          className="reveal reveal-up relative z-20 order-2 mx-auto flex max-w-[39rem] min-w-0 flex-col justify-center text-center lg:mx-0 lg:max-w-none lg:text-left"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Project Overview
          </p>
          <h2 className="mt-4 font-display text-[2.7rem] leading-[0.96] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[3.6rem] lg:text-[4.3rem]">
            The idea changed. The purpose stayed.
          </h2>

          <div className="mt-6 space-y-5 text-[color:var(--color-muted)] sm:mt-7">
            <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)] sm:text-[1.08rem] sm:leading-8">
              At the beginning of our investigation, Keep Your History was more
              focused on preserving personal histories through books and a
              website. Once we planned everything more carefully, we realized
              that some parts of the original idea would not work within our
              timeframe and circumstances.
            </p>
            <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
              Instead of abandoning the project, we adapted it into something
              more achievable while preserving the original goal: keeping older
              generations&apos; memories and life lessons alive while helping
              people in vulnerable situations through service, donations, and
              community connection.
            </p>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 sm:gap-5">
            <div className="rounded-[1.3rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.8)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                Investigation
              </p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-foreground)]">
                We identified the importance of intergenerational connection,
                empathy, and overlooked stories.
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.8)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                Service
              </p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-foreground)]">
                The project expanded beyond storytelling to include fundraising
                and donation coordination with the church community.
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.8)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                Creativity
              </p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-foreground)]">
                We translated messages, designed the visual identity, and built
                physical memory boxes to hold the cards.
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.8)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                Collaboration
              </p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-foreground)]">
                Because we were not physically in Brazil, trusted volunteers
                represented the project locally during donation distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        data-animate
        className="reveal reveal-up relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-40 w-[min(46rem,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,251,253,0.84),rgba(247,251,253,0.2)_58%,transparent)] blur-3xl" />

        <div
          data-animate
          className="reveal reveal-up relative z-10 mx-auto max-w-3xl text-center"
        >
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            Project Journey
          </p>
          <h2 className="mt-4 font-display text-[2.7rem] leading-[0.96] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[3.6rem] lg:text-[4.4rem]">
            Investigation, preparation, action, and reflection.
          </h2>
          <p className="mt-5 text-[1rem] leading-7 text-[color:var(--color-muted)] sm:text-[1.05rem] sm:leading-8">
            Keep Your History became a long-term project because it grew through
            planning, revision, communication, design work, and ongoing contact
            with the church group in Brazil.
          </p>
        </div>

        <div className="relative z-10 mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {journeyStages.map((stage, index) => (
            <article
              key={stage.label}
              data-animate
              data-animate-delay={40 + index * 60}
              className="reveal reveal-up rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(248,251,253,0.82)] p-6 shadow-[0_24px_50px_-36px_rgba(45,68,84,0.32)] backdrop-blur"
            >
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                {stage.label}
              </p>
              <h3 className="mt-4 text-[1.22rem] font-semibold leading-7 text-[color:var(--color-soft-foreground)]">
                {stage.title}
              </h3>
              <p className="mt-3 text-[0.96rem] leading-7 text-[color:var(--color-muted)]">
                {stage.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="impact"
        data-animate
        className="reveal reveal-up relative mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32"
      >
        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div data-animate className="reveal reveal-left">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Final Impact
            </p>
            <h2 className="mt-4 font-display text-[2.7rem] leading-[0.96] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[3.6rem] lg:text-[4.3rem]">
              What the project included in the end.
            </h2>

            <div className="mt-6 space-y-5 text-[color:var(--color-muted)]">
              <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)] sm:text-[1.08rem] sm:leading-8">
                The final version of Keep Your History combined storytelling,
                interviews, translation, design, website development,
                fundraising, organization, and service.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                Even though the website is still being refined, it became an
                important way to present the project as something lasting rather
                than a one-time activity.
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.82)] p-6 shadow-[0_20px_40px_-34px_rgba(45,68,84,0.3)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                Learning Outcomes
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {learningOutcomes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[rgba(84,112,130,0.16)] bg-[rgba(255,255,255,0.72)] px-3.5 py-2 text-[0.8rem] leading-5 text-[color:var(--color-foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[rgba(84,112,130,0.16)] shadow-[0_20px_38px_-30px_rgba(45,68,84,0.36)]">
                <Image
                  src="/WhatsApp Image May 10 2026 (1).jpeg"
                  alt="Donation support organized with the church community"
                  fill
                  sizes="(min-width: 1024px) 14rem, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[rgba(84,112,130,0.16)] shadow-[0_20px_38px_-30px_rgba(45,68,84,0.36)]">
                <Image
                  src="/WhatsApp Image May 10 2026 (2).jpeg"
                  alt="Volunteer group connected to the Keep Your History project"
                  fill
                  sizes="(min-width: 1024px) 14rem, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {impactCards.map((card, index) => (
              <article
                key={card.title}
                data-animate
                data-animate-delay={80 + index * 60}
                className="reveal reveal-up rounded-[1.9rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(249,252,254,0.88)] p-6 shadow-[0_22px_44px_-34px_rgba(45,68,84,0.32)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  Outcome {index + 1}
                </p>
                <h3 className="mt-4 text-[1.24rem] font-semibold text-[color:var(--color-soft-foreground)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.97rem] leading-7 text-[color:var(--color-muted)]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="who-we-are"
        data-animate
        className="reveal reveal-up relative mx-auto w-full max-w-7xl px-4 pb-24 pt-2 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32"
      >
        <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-16">
          <div
            data-animate
            className="reveal reveal-left mx-auto grid w-full max-w-[16rem] grid-cols-2 gap-3 sm:max-w-[24rem] sm:gap-4 lg:mx-0 lg:max-w-[17rem] lg:grid-cols-1 lg:gap-5 xl:max-w-[18rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] sm:rounded-[1.3rem] lg:rounded-[1.5rem]">
              <Image
                src="/ProfileOne.png"
                alt="One of the Keep Your History creators"
                fill
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 17rem, (min-width: 640px) 11rem, 7rem"
                className="object-cover"
              />
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] sm:rounded-[1.3rem] lg:rounded-[1.5rem]">
              <Image
                src="/ProfileTwo.jpg"
                alt="One of the Keep Your History creators"
                fill
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 17rem, (min-width: 640px) 11rem, 7rem"
                className="object-cover"
              />
            </div>
          </div>

          <div data-animate data-animate-delay="80" className="reveal reveal-up">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Who We Are
            </p>
            <h2 className="mt-4 font-display text-[2.7rem] leading-[0.96] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[3.6rem] lg:text-[4.3rem]">
              Two brothers building a CAS project between Brazil and the United
              States.
            </h2>

            <div className="mt-6 space-y-5 text-[color:var(--color-muted)]">
              <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)] sm:text-[1.08rem] sm:leading-8">
                We are students at Windermere Preparatory School, and Keep Your
                History is part of the IB CAS project we developed together.
                The project reflects both creativity and service, combining
                design work with real community support.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                Our work was shaped by family ties to Brazil and by the church
                community we knew there. Because we were coordinating much of
                the project remotely, we also learned how much trust,
                communication, and collaboration are required to create
                something meaningful at a distance.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                For us, this project is about more than preserving stories. It
                is about listening carefully, adapting when plans change, and
                creating something that helps people feel remembered, connected,
                and supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        data-animate
        className="reveal reveal-up relative scroll-mt-28 mx-auto w-full max-w-7xl px-4 pb-22 sm:px-8 sm:pb-26 lg:px-12 lg:pb-30"
      >
        <div className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-40 w-[min(44rem,88vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,251,253,0.88),rgba(247,251,253,0.22)_62%,transparent)] blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-10">
          <div data-animate className="reveal reveal-left">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Contact
            </p>
            <h2 className="mt-4 font-display text-[2.2rem] leading-[0.98] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[2.8rem]">
              Bring Keep Your History to another community.
            </h2>
            <p className="mt-4 max-w-[30rem] text-[0.98rem] leading-7 text-[color:var(--color-muted)] sm:text-[1rem]">
              If your school, church, organization, or community group wants to
              learn more, collaborate, or adapt this idea for another place,
              send us a message.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.2rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.82)] p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                  Schools and CAS programs
                </p>
                <p className="mt-2 text-[0.94rem] leading-6 text-[color:var(--color-foreground)]">
                  We can share how the project was planned, adapted, and carried
                  out across different stages.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(84,112,130,0.16)] bg-[rgba(248,251,253,0.82)] p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-accent)]">
                  Churches and community groups
                </p>
                <p className="mt-2 text-[0.94rem] leading-6 text-[color:var(--color-foreground)]">
                  The format can support storytelling, outreach, memory
                  preservation, and service initiatives.
                </p>
              </div>
            </div>
          </div>

          <div
            data-animate
            data-animate-delay="120"
            className="reveal reveal-up"
          >
            <form
              onSubmit={handleRequestSubmit}
              onChange={handleRequestChange}
              className="request-form-panel grid gap-4 rounded-[1.1rem] border border-[rgba(88,116,134,0.24)] bg-[rgba(249,252,254,0.9)] p-5 sm:p-6"
            >
              <label className="request-field">
                <span className="request-label">Organization</span>
                <input
                  type="text"
                  name="organizationName"
                  required
                  autoComplete="organization"
                  className="request-control"
                  placeholder="School, parish, or community organization"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="request-field">
                  <span className="request-label">Contact Person</span>
                  <input
                    type="text"
                    name="contactName"
                    required
                    autoComplete="name"
                    className="request-control"
                    placeholder="Full name"
                  />
                </label>

                <label className="request-field">
                  <span className="request-label">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="request-control"
                    placeholder="name@example.org"
                  />
                </label>
              </div>

              <label className="request-field">
                <span className="request-label">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  className="request-control"
                  placeholder="+1 (000) 000-0000"
                />
              </label>

              <label className="request-field">
                <span className="request-label">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="request-control min-h-[8rem] resize-y py-2.5"
                  placeholder="Tell us about your community, your interest in the project, or how you would like to collaborate."
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-[rgba(88,116,134,0.2)] pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.82rem] text-[color:var(--color-muted)]">
                  We use this only to reply to your message.
                </p>
                <button
                  type="submit"
                  disabled={isRequestSubmitting}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(74,102,121,0.24)] bg-[rgba(214,228,236,0.96)] px-6 text-[0.74rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(214,228,236,1)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRequestSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>

              {requestError ? (
                <p
                  aria-live="polite"
                  className="rounded-md border border-[rgba(148,90,96,0.28)] bg-[rgba(243,229,232,0.72)] px-3 py-2 text-[0.88rem] text-[color:var(--color-foreground)]"
                >
                  {requestError}
                </p>
              ) : null}

              {requestSubmitted ? (
                <p
                  aria-live="polite"
                  className="rounded-md border border-[rgba(74,102,121,0.24)] bg-[rgba(222,235,243,0.56)] px-3 py-2 text-[0.88rem] text-[color:var(--color-foreground)]"
                >
                  Thanks. We received your message and will contact you shortly.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <footer
        data-animate
        className="reveal reveal-up relative border-t border-[color:var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(241,248,251,0.64),rgba(224,236,243,0.74))]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] md:gap-10">
            <div>
              <p className="font-display text-[1.85rem] leading-[0.95] tracking-[0.01em] text-[color:var(--color-soft-foreground)] sm:text-[2.15rem]">
                Keep Your History
              </p>
              <p className="mt-3 max-w-[24rem] text-[0.92rem] leading-7 text-[color:var(--color-muted)]">
                Preserving life lessons, memories, and community support
                through storytelling, bilingual cards, memory boxes, and
                service.
              </p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)] md:text-right">
                Links
              </p>
              <div className="mt-4 grid gap-2 text-[0.93rem] text-[color:var(--color-muted)] md:text-right">
                <a
                  href="#project"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Project Overview
                </a>
                <a
                  href="#journey"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Project Journey
                </a>
                <a
                  href="#contact"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Contact
                </a>
                <a
                  href="https://www.windermereprep.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Windermere Preparatory School
                </a>
                <a
                  href="https://www.ibo.org/programmes/diploma-programme/curriculum/creativity-activity-and-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  IB CAS Program
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[color:var(--color-border)] pt-5 text-[0.8rem] text-[color:var(--color-muted)]">
            © {new Date().getFullYear()} Keep Your History. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
