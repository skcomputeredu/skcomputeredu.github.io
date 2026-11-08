import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CourseCard, Eyebrow } from "@/components/bits";
import { categories, courseFullForm, courseTitle, courses, presentCourse, type CategoryId } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";

const known = ["all", "foundation", "diploma", "office", "creative", "technical"] as const;

export const Route = createFileRoute("/courses")({
  validateSearch: (search: Record<string, unknown>) => {
    const cat = typeof search.cat === "string" && known.includes(search.cat as (typeof known)[number])
      ? search.cat
      : "all";
    return { cat };
  },
  head: () => ({
    meta: [{ title: "कोर्सेज · SK Computer & Education Centre" }],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/courses" });
  const { lang } = useI18n();
  const [query, setQuery] = useState("");
  const [table, setTable] = useState(false);
  const copy =
    lang === "en"
      ? {
          title: "All Courses",
          body: "Cards or a table — open a name. Inside: duration, syllabus points, a project and who the course is for.",
          search: "Search a name — Excel, CCC, typing",
          searchLabel: "Search courses",
          cards: "Cards",
          table: "Duration table",
          courseWord: "courses",
          empty: "No course by that name. Try another spelling, or see all courses.",
          sno: "No.",
          name: "Course",
          level: "Level",
          duration: "Duration",
          note: "School tuition is separate —",
          tuition: "class 1 to 12",
          note2: ". Duration can shift a little with the batch and your pace.",
        }
      : {
          title: "सभी कोर्स",
          body: "कार्ड या तालिका — नाम पर जाएँ। अंदर अवधि, सिलेबस के पॉइंट, प्रोजेक्ट और यह कि कोर्स किसके लिए है।",
          search: "नाम खोजें — Excel, CCC, टाइपिंग",
          searchLabel: "कोर्स खोजें",
          cards: "कार्ड",
          table: "अवधि तालिका",
          courseWord: "कोर्स",
          empty: "इस नाम का कोर्स नहीं मिला। दूसरी स्पेलिंग आज़माएँ या सभी कोर्सेज देखें।",
          sno: "क्रमांक",
          name: "कोर्स",
          level: "स्तर",
          duration: "अवधि",
          note: "स्कूल ट्यूशन अलग है —",
          tuition: "कक्षा 1 से 12",
          note2: ". अवधि बैच और आपकी गति से थोड़ी बदल सकती है।",
        };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = (course: (typeof courses)[number]) => {
      if (!q) return 0;
      const name = course.name.toLowerCase();
      const hindi = course.hindi.toLowerCase();
      if (name === q || hindi === q) return 0;
      if (name.startsWith(q) || hindi.startsWith(q)) return 1;
      if (name.includes(q) || hindi.includes(q)) return 2;
      const view = presentCourse(course, lang);
      if (view.tools.some((tool) => tool.toLowerCase().includes(q))) return 3;
      return 4;
    };
    return courses
      .map((course, index) => ({ course, index }))
      .filter(({ course }) => {
        const view = presentCourse(course, lang);
        const categoryOk = cat === "all" || course.category === cat;
        const text = `${course.name} ${course.hindi} ${view.summary} ${view.tools.join(" ")}`.toLowerCase();
        return categoryOk && (q === "" || text.includes(q));
      })
      .sort((a, b) => rank(a.course) - rank(b.course) || a.index - b.index)
      .map(({ course }) => course);
  }, [cat, query, lang]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <Eyebrow>Our courses</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-navy md:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{copy.body}</p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="sr-only" htmlFor="course-search">
          {copy.searchLabel}
        </label>
        <input
          id="course-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.search}
          className="min-h-12 w-full rounded-full border border-line bg-paper px-5 text-ink outline-none focus:border-navy md:max-w-md"
        />
        <div className="flex rounded-full border border-line bg-paper p-1">
          <button
            type="button"
            onClick={() => setTable(false)}
            className={`min-h-10 rounded-full px-4 text-sm font-semibold ${table ? "text-muted" : "bg-navy text-ivory"}`}
          >
            {copy.cards}
          </button>
          <button
            type="button"
            onClick={() => setTable(true)}
            className={`min-h-10 rounded-full px-4 text-sm font-semibold ${table ? "bg-navy text-ivory" : "text-muted"}`}
          >
            {copy.table}
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const active = cat === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate({ search: { cat: category.id } })}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${
                active ? "bg-gold text-navy" : "border border-line bg-paper text-navy"
              }`}
            >
              {category.label[lang]}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">
        {categories.find((category) => category.id === cat)?.blurb[lang]} · {filtered.length} {copy.courseWord}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-line bg-paper p-8 text-navy">
          {copy.empty}
        </p>
      ) : table ? (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-paper">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-ivory">
              <tr>
                <th className="px-4 py-3 font-semibold">{copy.sno}</th>
                <th className="px-4 py-3 font-semibold">{copy.name}</th>
                <th className="px-4 py-3 font-semibold">{copy.level}</th>
                <th className="px-4 py-3 font-semibold">{copy.duration}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const view = presentCourse(course, lang);
                return (
                <tr key={course.slug} className="border-t border-line">
                  <td className="px-4 py-3 tabular-nums text-gold-deep">{course.code}</td>
                  <td className="px-4 py-3">
                    <Link to="/course/$slug" params={{ slug: course.slug }} className="font-semibold text-navy">
                      {courseTitle(course, lang)}
                    </Link>
                    {courseFullForm(course, lang) ? (
                      <p className="text-sm text-muted">{courseFullForm(course, lang)}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{view.level}</td>
                  <td className="px-4 py-3 font-semibold text-navy">{view.duration}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        {copy.note}{" "}
        <Link to="/tuition" className="font-semibold text-navy">
          {copy.tuition}
        </Link>
        {copy.note2}
      </p>
    </div>
  );
}

export type CourseCategorySearch = CategoryId | "all";
