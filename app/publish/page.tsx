import {
  FileText,
  ImageIcon,
  Link2,
  ListOrdered,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const toolbar = ["B", "I", "G", "H1", "H2", "99", "<>", ""];

export default function PublishPage() {
  return (
    <div className="bg-[#f5f3f0] text-slate-900">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.7fr_0.7fr]">
        <section className="rounded-[24px] border border-[#dfe1dc] bg-[#f8f7f5] p-5 sm:p-6">
          <div className="mb-6 rounded-2xl border border-[#dfe1dc] bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              {toolbar.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium ${
                    item
                      ? "border-[#dfe1dc] bg-white text-slate-700"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  {item || "•"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Input
              className="h-auto border-0 bg-transparent px-0 text-5xl font-semibold leading-[0.9] tracking-[-0.08em] text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-0 sm:text-6xl"
              placeholder="The Architecture of Solitude: Designing Workspaces for Deep Thought"
            />

            <div className="max-w-3xl text-2xl leading-relaxed text-slate-600">
              How intentional acoustic design and tactile materials require
              creative focus.
            </div>

            <div className="flex flex-wrap items-center gap-4 border-y border-[#dfe1dc] py-3 text-sm text-slate-500">
              <span>By Alex Haslam</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Architecture &amp; Thought</span>
            </div>

            <div className="space-y-5 text-lg leading-9 text-slate-700">
              <p>
                Silence is no longer an ambient condition of the natural world;
                in the contemporary urban sprawls, it is an engineered luxury.
                When we step inside rooms designed under the dictates of modern
                minimalism, we quickly realize that what appears empty is
                actually filled with an intense psychological weight.
              </p>
              <p>
                Physical space exerts a quiet, continuous gravitational pull on
                cognitive flow. This is the reason intentional architectural
                design can sharpen focus and rearrange attention in ways that
                standard office layouts cannot.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#dfe1dc] bg-white p-3">
              <div className="flex items-center justify-between border-b border-[#dfe1dc] pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>Article body</span>
                <span>Ready</span>
              </div>
              <div className="mt-4">
                <Textarea
                  defaultValue={
                    "Silence is no longer an ambient condition of the natural world; in the contemporary urban sprawls, it is an engineered luxury. When we step inside rooms designed under the dictates of modern minimalism, we quickly realize that what appears empty is actually filled with an intense psychological weight.\n\nPhysical space exerts a quiet, continuous gravitational pull on cognitive flow. This is the reason intentional architectural design can sharpen focus and rearrange attention in ways that standard office layouts cannot."
                  }
                  className="min-h-[260px] border-0 bg-transparent p-0 text-lg leading-8 text-slate-700 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="border-[#dfe1dc] bg-[#f8f7f5] p-4">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                Story Settings
              </h3>
              <button className="text-sm text-slate-500">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Topics &amp; tags
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full bg-[#ece8e3] text-slate-700"
                  >
                    Architecture ×
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full bg-[#ece8e3] text-slate-700"
                  >
                    Design ×
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full bg-[#ece8e3] text-slate-700"
                  >
                    Productivity ×
                  </Badge>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  SEO &amp; permalink
                </p>
                <Input
                  value="noted.com/alex-haslam/architecture-of-sol-"
                  readOnly
                  className="bg-[#f0efec]"
                />
              </div>

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Audience access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-center bg-white text-slate-900"
                  >
                    Public
                  </Button>
                  <Button variant="secondary" className="justify-center">
                    Subscribers
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email dispatch
                </p>
                <div className="flex items-center justify-between rounded-xl border border-[#dfe1dc] bg-[#f2f1ee] px-3 py-3">
                  <span className="text-sm text-slate-700">
                    Send as instant email to 4,280 subscribers
                  </span>
                  <button className="h-6 w-11 rounded-full bg-slate-900 p-1">
                    <span className="block h-4 w-4 rounded-full bg-white translate-x-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
