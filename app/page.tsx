"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";

import { ClosedBookScene } from "./components/closed-book-scene";
import { FallingPapers } from "./components/falling-papers";
import { OpenBookScene } from "./components/open-book-scene";

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);
  const [showHeroBook, setShowHeroBook] = useState(false);
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
        throw new Error(data?.error ?? "Unable to send your request right now.");
      }

      setRequestSubmitted(true);
      form.reset();
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Unable to send your request right now.",
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
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncHeroBookVisibility = (event?: MediaQueryListEvent) => {
      setShowHeroBook(event ? event.matches : mediaQuery.matches);
    };

    syncHeroBookVisibility();
    mediaQuery.addEventListener("change", syncHeroBookVisibility);

    return () => {
      mediaQuery.removeEventListener("change", syncHeroBookVisibility);
    };
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,194,165,0.34),transparent_40%),radial-gradient(circle_at_50%_72%,rgba(225,205,178,0.32),transparent_36%),linear-gradient(180deg,#fffaf4_0%,#fdf7f0_42%,#f8efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,250,244,0.94),rgba(255,250,244,0))]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(248,239,228,0),rgba(239,224,204,0.42))]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <FallingPapers />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 w-full border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/90 shadow-[0_18px_50px_-38px_rgba(122,91,57,0.34)] backdrop-blur transition-all duration-300 ${
          showHeader
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <a href="#" className="flex items-center">
            <span className="font-display text-[1.45rem] font-semibold leading-none text-[color:var(--color-accent)] sm:text-[1.7rem]">
              K
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-[color:var(--color-muted)] md:flex">
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#how-it-works"
            >
              How it works
            </a>
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#for-places"
            >
              For places
            </a>
            <a
              className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
              href="#contact"
            >
              Contact
            </a>
          </nav>

          <a
            href="#order"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-accent-soft)] px-4 py-2 text-[0.78rem] font-semibold text-[color:var(--color-foreground)] shadow-[0_10px_24px_-18px_rgba(122,91,57,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(233,214,188,0.95)] sm:px-5 sm:py-2.5"
          >
            Order
          </a>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 text-center sm:gap-12 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-28 lg:text-left">
        <div className="pointer-events-none absolute left-1/2 top-[10%] z-[2] h-32 w-[min(34rem,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,249,241,0.92),rgba(255,249,241,0.58)_42%,transparent_74%)] blur-2xl sm:h-40 sm:w-[min(48rem,88vw)] lg:top-[15%] lg:h-44 lg:w-[min(58rem,88vw)]" />
        <div className="pointer-events-none absolute left-1/2 top-[56%] z-[2] h-52 w-[min(38rem,94vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,244,0.84),rgba(255,250,244,0.32)_44%,transparent_72%)] blur-3xl sm:h-72 sm:w-[min(58rem,92vw)] lg:top-[54%] lg:h-80 lg:w-[min(70rem,96vw)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[38rem] flex-col items-center justify-center lg:col-span-5 lg:mx-0 lg:max-w-none lg:items-start">
          <h1 className="mx-auto w-fit text-center font-[family:var(--font-cormorant-garamond)] text-[2.9rem] leading-[0.94] text-[color:var(--color-soft-foreground)] sm:text-[4.2rem] lg:mx-0 lg:text-left lg:text-[4.9rem] xl:text-[5.7rem]">
            <span className="block font-[700] tracking-[0.02em] text-[color:var(--color-accent)]">
              Keep your history
            </span>
            <span className="mt-1 block font-[600]">
              alive
            </span>
          </h1>

          <div className="mt-6 max-w-[34rem] space-y-4 sm:mt-8 sm:space-y-5">
            <p className="text-[1rem] leading-[1.7] text-[color:var(--color-foreground)] sm:text-[1.12rem] sm:leading-[1.75]">
              We partner with retirement homes, veterans&apos; homes,
              hospitals, and care communities to turn lived experiences into
              printed books.
            </p>
            <p className="text-[0.94rem] leading-7 text-[color:var(--color-muted)] sm:text-[1.02rem] sm:leading-8">
              Each book protects voices that might otherwise fade, giving
              families, students, and future generations something real to
              hold, read, and share.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex w-full max-w-[32rem] flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center lg:w-auto lg:max-w-none lg:items-start">
            <a
              href="#about-us"
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-[rgba(155,122,88,0.26)] bg-[rgba(235,213,184,0.9)] px-6 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-foreground)] shadow-[0_18px_34px_-26px_rgba(122,91,57,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(235,213,184,1)] hover:shadow-[0_22px_38px_-26px_rgba(122,91,57,0.54)] sm:min-w-[11.5rem] sm:px-7 sm:py-4 sm:text-[0.8rem]"
            >
              Discover
            </a>
            <a
              href="#order"
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-[rgba(176,149,121,0.22)] bg-[rgba(255,251,246,0.84)] px-6 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_16px_30px_-26px_rgba(122,91,57,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,251,246,0.94)] sm:min-w-[11.5rem] sm:px-7 sm:py-4 sm:text-[0.8rem]"
            >
              Request a Book
            </a>
          </div>
        </div>

        {showHeroBook ? (
          <div className="relative z-10 mx-auto flex h-[20rem] w-full max-w-[35rem] items-center justify-center sm:h-[25rem] sm:max-w-[43rem] lg:col-span-7 lg:mx-0 lg:h-[42rem] lg:max-w-none lg:justify-end">
            <div className="pointer-events-none absolute inset-x-[7%] top-[12%] h-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,251,244,0.9),rgba(255,251,244,0.08)_68%,transparent)] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[9%] h-[22%] rounded-full bg-[radial-gradient(circle,rgba(224,197,164,0.24),rgba(224,197,164,0)_72%)] blur-2xl" />
            <div className="relative mx-auto h-full w-full lg:mx-0 lg:ml-auto lg:w-[132%] xl:w-[138%] 2xl:w-[142%]">
              <OpenBookScene />
            </div>
          </div>
        ) : null}
      </section>

      <section
        id="about-us"
        className="relative scroll-mt-28 grid w-full items-center gap-10 overflow-hidden px-4 pb-18 pt-10 sm:gap-12 sm:px-8 sm:pb-24 sm:pt-12 lg:min-h-[44rem] lg:grid-cols-2 lg:gap-0 lg:px-0 lg:py-24"
      >
        <div className="pointer-events-none absolute left-1/2 top-[22%] z-[1] h-32 w-[min(34rem,86vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,244,0.86),rgba(255,250,244,0.18)_62%,transparent)] blur-3xl sm:h-40 sm:w-[min(46rem,82vw)]" />
        <div className="pointer-events-none absolute left-[26%] top-[54%] z-[1] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(225,198,165,0.2),rgba(225,198,165,0)_72%)] blur-3xl" />

        <div className="relative z-10 order-1 flex w-full items-center justify-center lg:col-start-1 lg:min-h-[44rem] lg:justify-self-stretch lg:self-stretch">
          <div className="relative h-[20rem] w-full sm:h-[24rem] lg:h-full lg:w-full">
            <div className="relative h-full w-full overflow-hidden">
              <ClosedBookScene />
            </div>
          </div>
        </div>

        <div className="relative z-20 order-2 mx-auto flex max-w-[39rem] min-w-0 flex-col justify-center text-center lg:col-start-2 lg:mx-0 lg:max-w-none lg:pl-12 lg:pr-12 lg:text-left xl:pl-16 xl:pr-20">
          <h2 className="font-[family:var(--font-cormorant-garamond)] text-[2.8rem] leading-[0.94] text-[color:var(--color-soft-foreground)] sm:text-[3.7rem] lg:text-[4.7rem]">
            Every person carries a history worth keeping.
          </h2>

          <div className="mt-6 space-y-5 text-[color:var(--color-muted)] sm:mt-7">
            <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)] sm:text-[1.08rem] sm:leading-8">
              KeepYourHistory works with institutions that care for elders,
              veterans, patients, and residents to gather personal histories,
              memories, and reflections into a physical archive.
            </p>
            <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
              The result is a printed book the institution can keep and share,
              honoring each person beyond their lifetime and making their
              experiences accessible to the wider community.
            </p>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 sm:gap-5">
            <div className="border-t border-[color:var(--color-border-strong)] pt-4">
              <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)]">
                Not everyone leaves behind a biography. We help create a record
                so ordinary lives are preserved with the dignity they deserve.
              </p>
            </div>
            <div className="border-t border-[color:var(--color-border-strong)] pt-4">
              <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)]">
                These books keep stories available to families, students, and
                society, allowing each life to keep contributing through what
                it lived and learned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-40 w-[min(46rem,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,249,241,0.84),rgba(255,249,241,0.18)_58%,transparent)] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
            How It Works
          </p>
          <h2 className="mt-4 font-[family:var(--font-cormorant-garamond)] text-[2.8rem] leading-[0.94] text-[color:var(--color-soft-foreground)] sm:text-[3.7rem] lg:text-[4.7rem]">
            From lived experience to a book that stays.
          </h2>
          <p className="mt-5 text-[1rem] leading-7 text-[color:var(--color-muted)] sm:text-[1.05rem] sm:leading-8">
            We make the process simple for institutions while giving each
            participant space to share the memories, milestones, and personal
            details that matter most.
          </p>
        </div>

        <div className="relative z-10 mt-12 grid gap-5 lg:grid-cols-4">
          <article className="rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(255,251,246,0.82)] p-6 shadow-[0_24px_50px_-36px_rgba(122,91,57,0.34)] backdrop-blur">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Step 1
            </p>
            <h3 className="mt-4 text-[1.3rem] font-semibold text-[color:var(--color-soft-foreground)]">
              We partner with your institution
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-muted)]">
              A retirement home, veterans&apos; home, hospital, or care
              community contacts us, and we organize the project around the
              people who want to participate.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(255,251,246,0.82)] p-6 shadow-[0_24px_50px_-36px_rgba(122,91,57,0.34)] backdrop-blur">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Step 2
            </p>
            <h3 className="mt-4 text-[1.3rem] font-semibold text-[color:var(--color-soft-foreground)]">
              We gather each person&apos;s story
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-muted)]">
              Histories can be collected online or in person through guided
              questions, short biographies, personal reflections, and selected
              photographs.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(255,251,246,0.82)] p-6 shadow-[0_24px_50px_-36px_rgba(122,91,57,0.34)] backdrop-blur">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Step 3
            </p>
            <h3 className="mt-4 text-[1.3rem] font-semibold text-[color:var(--color-soft-foreground)]">
              We design the book
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-muted)]">
              Each participant receives a two-page spread that can include
              images, written responses, a brief life story, and the details
              that help their memory feel personal and complete.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(255,251,246,0.82)] p-6 shadow-[0_24px_50px_-36px_rgba(122,91,57,0.34)] backdrop-blur">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Step 4
            </p>
            <h3 className="mt-4 text-[1.3rem] font-semibold text-[color:var(--color-soft-foreground)]">
              We print, deliver, and preserve access
            </h3>
            <p className="mt-3 text-[0.98rem] leading-7 text-[color:var(--color-muted)]">
              We print the finished book and send it to the location, while
              also preserving the histories online so they remain accessible in
              both physical and digital form.
            </p>
          </article>
        </div>
      </section>

      <section
        id="who-we-are"
        className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32"
      >
        <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-16">
          <div className="mx-auto grid w-full max-w-[16rem] grid-cols-2 gap-3 sm:max-w-[24rem] sm:gap-4 lg:mx-0 lg:max-w-[17rem] lg:grid-cols-1 lg:gap-5 xl:max-w-[18rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] sm:rounded-[1.3rem] lg:rounded-[1.5rem]">
              <Image
                src="/ProfileOne.png"
                alt="One of the KeepYourHistory student creators"
                fill
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 17rem, (min-width: 640px) 11rem, 7rem"
                className="object-cover"
              />
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] sm:rounded-[1.3rem] lg:rounded-[1.5rem]">
              <Image
                src="/ProfileTwo.jpg"
                alt="One of the KeepYourHistory student creators"
                fill
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 17rem, (min-width: 640px) 11rem, 7rem"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Who We Are
            </p>
            <h2 className="mt-4 font-[family:var(--font-cormorant-garamond)] text-[2.8rem] leading-[0.94] text-[color:var(--color-soft-foreground)] sm:text-[3.7rem] lg:text-[4.7rem]">
              Two students from Windermere Preparatory School.
            </h2>

            <div className="mt-6 space-y-5 text-[color:var(--color-muted)]">
              <p className="text-[1rem] leading-7 text-[color:var(--color-foreground)] sm:text-[1.08rem] sm:leading-8">
                We are two high school students from Windermere Preparatory
                School, and KeepYourHistory is part of the IB CAS project we
                are developing to help preserve people&apos;s stories.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                The idea came from our own families. One of our grandparents
                was a veteran, and another was a priest who passed away. Their
                lives had meaning, service, and experiences worth remembering,
                but we realized how easily those histories can disappear with
                time.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                We started this project because we do not want those stories to
                end with memory alone. We want to help institutions and
                families keep those histories available in a way that can be
                read, shared, and passed on.
              </p>
              <p className="text-[0.98rem] leading-7 sm:text-[1.04rem] sm:leading-8">
                For us, this is not only a school project. It is a way to honor
                our grandparents and to make sure many other people are
                remembered with the same care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="order"
        className="relative scroll-mt-28 mx-auto w-full max-w-7xl px-4 pb-22 sm:px-8 sm:pb-26 lg:px-12 lg:pb-30"
      >
        <div id="for-places" className="pointer-events-none absolute -top-28" />
        <div id="contact" className="pointer-events-none absolute -top-28" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-40 w-[min(44rem,88vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,249,241,0.88),rgba(255,249,241,0.18)_62%,transparent)] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="text-center font-[family:var(--font-cormorant-garamond)] text-[2.15rem] leading-[0.95] text-[color:var(--color-soft-foreground)] sm:text-[2.7rem]">
            Request a Book
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[0.96rem] leading-7 text-[color:var(--color-muted)] sm:text-[1rem]">
            Share your organization details and we&apos;ll follow up to plan
            your project.
          </p>

          <form
            onSubmit={handleRequestSubmit}
            onChange={handleRequestChange}
            className="request-form-panel mt-6 grid gap-4 rounded-[0.86rem] border border-[rgba(168,136,103,0.22)] bg-[rgba(255,252,248,0.9)] p-5 sm:p-6"
          >
              <label className="request-field">
                <span className="request-label">Organization Name</span>
                <input
                  type="text"
                  name="organizationName"
                  required
                  autoComplete="organization"
                  className="request-control"
                  placeholder="Windermere Care Center"
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
                  <span className="request-label">Work Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="request-control"
                    placeholder="name@organization.org"
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
                  rows={4}
                  className="request-control min-h-[7rem] resize-y py-2.5"
                  placeholder="Tell us about your institution and what you need."
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-[rgba(170,138,105,0.2)] pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.82rem] text-[color:var(--color-muted)]">
                  We use this only to contact your organization.
                </p>
                <button
                  type="submit"
                  disabled={isRequestSubmitting}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(155,122,88,0.24)] bg-[rgba(235,213,184,0.95)] px-6 text-[0.75rem] font-semibold uppercase tracking-[0.19em] text-[color:var(--color-foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(235,213,184,1)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRequestSubmitting ? "Sending..." : "Send Request"}
                </button>
              </div>

            {requestError ? (
              <p
                aria-live="polite"
                className="rounded-md border border-[rgba(164,95,84,0.3)] bg-[rgba(244,222,218,0.65)] px-3 py-2 text-[0.88rem] text-[color:var(--color-foreground)]"
              >
                {requestError}
              </p>
            ) : null}

            {requestSubmitted ? (
              <p
                aria-live="polite"
                className="rounded-md border border-[rgba(155,122,88,0.24)] bg-[rgba(244,234,218,0.5)] px-3 py-2 text-[0.88rem] text-[color:var(--color-foreground)]"
              >
                Thanks. We received your request and will contact you shortly.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <footer className="relative border-t border-[color:var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(252,245,236,0.62),rgba(246,234,219,0.72))]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,20rem)] md:gap-10">
            <div>
              <p className="font-[family:var(--font-cormorant-garamond)] text-[1.85rem] leading-[0.92] text-[color:var(--color-soft-foreground)] sm:text-[2.15rem]">
                KeepYourHistory
              </p>
              <p className="mt-3 max-w-[22rem] text-[0.92rem] leading-7 text-[color:var(--color-muted)]">
                Preserving personal histories through printed books for care
                institutions and future generations.
              </p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)] md:text-right">
                Links
              </p>
              <div className="mt-4 grid gap-2 text-[0.93rem] text-[color:var(--color-muted)] md:text-right">
                <a
                  href="#order"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Order a Book
                </a>
                <a
                  href="https://github.com/luciano655dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  GitHub
                </a>
                <a
                  href="https://instagram.com/luciano655dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[color:var(--color-soft-foreground)]"
                >
                  Instagram
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
            © {new Date().getFullYear()} KeepYourHistory. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
