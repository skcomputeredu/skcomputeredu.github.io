import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, GraduationCap, Laptop } from "lucide-react";
import { CallLink, CourseCard, CourseGlyph, Eyebrow, Points, Syllabus, WhatsAppLink } from "@/components/bits";
import { Enquiry } from "@/components/enquiry";
import { categoryLabel, courseFullForm, courseImage, courseTitle, getCourse, presentCourse, relatedCourses } from "@/lib/courses";
import { useCopy, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/course/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${getCourse(params.slug)?.name ?? "कोर्स"} · SK Computer & Education Centre` }],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const found = getCourse(slug);
  const { lang } = useI18n();
  const t = useCopy();
  const course = found ? presentCourse(found, lang) : undefined;

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="font-display text-4xl text-navy">{t.missing}</h1>
        <Link to="/courses" search={{ cat: "all" }} className="mt-6 inline-flex font-semibold text-navy">
          {t.seeAll}
        </Link>
      </div>
    );
  }

  const related = relatedCourses(course);
  const full = courseFullForm(course, lang);

  return (
    <article>
      <header className="bg-navy text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm text-brass">
              <Link to="/courses" search={{ cat: "all" }} className="hover:text-gold">
                {t.courses}
              </Link>
              <span aria-hidden="true"> · </span>
              {categoryLabel(course.category, lang)}
            </p>
            <p className="mt-4 font-display text-xl text-gold">{course.code}</p>
            <h1 className="mt-2 font-display text-4xl text-ivory md:text-6xl">
              {courseTitle(course, lang)}
            </h1>
            {full ? <p className="mt-2 text-lg text-brass md:text-xl">{full}</p> : null}
            <p className="mt-5 max-w-xl text-ivory">{course.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ivory/10 px-4 text-sm">
                <Clock className="size-4 text-gold" aria-hidden="true" />
                {course.duration}
              </span>
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ivory/10 px-4 text-sm">
                <GraduationCap className="size-4 text-gold" aria-hidden="true" />
                {course.level}
              </span>
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ivory/10 px-4 text-sm">
                <Laptop className="size-4 text-gold" aria-hidden="true" />
                {t.practical}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <CallLink>{t.callCourse}</CallLink>
              <WhatsAppLink text={t.waCourse(course.name, course.duration)}>
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <div className="relative">
            <img
              src={courseImage(course)}
              alt=""
              className="h-72 w-full rounded-3xl object-cover md:h-96"
            />
            <span className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 text-navy">
              <CourseGlyph slug={course.slug} className="size-5" />
              <span>
                <span className="block text-xs text-muted">{t.duration}</span>
                <span className="font-semibold">{course.duration}</span>
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3 md:py-16">
        <div className="md:col-span-2">
          <Eyebrow>{t.syllabus}</Eyebrow>
          <h2 className="mt-2 font-display text-3xl text-navy">{t.openPoints}</h2>
          <p className="mt-3 mb-6 text-muted">{t.openPointsBody}</p>
          <Syllabus modules={course.modules} />

          <h2 className="mt-12 font-plain text-3xl font-bold text-navy">{t.project}</h2>
          <p className="mt-3 text-ink">{course.project}</p>
          {course.note ? (
            <p className="mt-4 rounded-2xl bg-brass px-4 py-3 text-sm text-navy">{course.note}</p>
          ) : null}
        </div>
        <aside className="space-y-6">
          <section className="rounded-3xl border border-line bg-paper p-5">
            <h2 className="font-sans text-lg font-semibold text-navy">{t.forWhom}</h2>
            <div className="mt-4">
              <Points items={course.forWhom} />
            </div>
          </section>
          <section className="rounded-3xl border border-line bg-paper p-5">
            <h2 className="font-sans text-lg font-semibold text-navy">{t.after}</h2>
            <div className="mt-4">
              <Points items={course.outcomes} />
            </div>
          </section>
          <section className="rounded-3xl bg-navy p-5 text-ivory">
            <h2 className="font-sans text-lg font-semibold">{t.certTools}</h2>
            <p className="mt-3 text-brass">{course.certificate}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {course.tools.map((tool) => (
                <li key={tool} className="rounded-full bg-ivory/10 px-3 py-1 text-sm">
                  {tool}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-brass">{t.feeNote}</p>
          </section>
        </aside>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12">
        <Enquiry preset={course.name} />
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="font-display text-3xl text-navy">{t.related}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((item) => (
            <CourseCard key={item.slug} course={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
