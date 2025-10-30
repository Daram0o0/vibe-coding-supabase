'use client';

import { useState } from "react";
import Magazines from "@/components/magazines";
import MagazinesDetail from "@/components/magazines-detail";
import MagazinesNew from "@/components/magazines-new";
import Payments from "@/components/payments";
import AuthLogin from "@/components/auth-login";
import { 
  BookOpen, 
  CreditCard, 
  FileEdit, 
  Lock, 
  Library, 
  ArrowRight,
  ArrowLeft 
} from "lucide-react";

type ComponentKey = 
  | "home"
  | "glossaryMagazines"
  | "detailMagazine"
  | "magazineNew"
  | "payments"
  | "authLogin";

interface ComponentItem {
  key: ComponentKey;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  component: React.ComponentType;
}

const components: ComponentItem[] = [
  {
    key: "glossaryMagazines",
    title: "매거진 카드 목록",
    description: "IT 매거진 아티클들을 카드 형태로 보여주는 반응형 그리드 레이아웃",
    icon: Library,
    color: "#6366f1",
    component: Magazines,
  },
  {
    key: "detailMagazine",
    title: "아티클 상세 페이지",
    description: "IT 매거진 아티클의 상세 내용을 표시하는 페이지",
    icon: BookOpen,
    color: "#ec4899",
    component: MagazinesDetail,
  },
  {
    key: "magazineNew",
    title: "아티클 등록",
    description: "새로운 IT 매거진 아티클을 등록하는 입력 폼",
    icon: FileEdit,
    color: "#06b6d4",
    component: MagazinesNew,
  },
  {
    key: "payments",
    title: "구독 결제",
    description: "IT 매거진 월간 구독 결제 페이지",
    icon: CreditCard,
    color: "#f59e0b",
    component: Payments,
  },
  {
    key: "authLogin",
    title: "로그인",
    description: "구글 로그인 및 무료 콘텐츠 접근 페이지",
    icon: Lock,
    color: "#10b981",
    component: AuthLogin,
  },
];

function HomePage({ onNavigate }: { onNavigate: (key: ComponentKey) => void }) {
  return (
    <div className="min-h-screen bg-[#fafbfc] px-6 py-15">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-gray-800 mb-2 tracking-tight">
            IT 매거진 컴포넌트
          </h1>
          <p className="text-base text-[#6e7781] leading-normal">
            모든 컴포넌트를 둘러보고 기능을 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {components.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.key}
                className="bg-white border border-[#d0d7de] rounded-xl p-6 cursor-pointer transition-all duration-200 relative overflow-hidden hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/10 hover:-translate-y-0.5 group before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-600 before:to-purple-600 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100"
                onClick={() => onNavigate(item.key)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: item.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-[17px] font-semibold text-gray-800 m-0">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-[#57606a] leading-relaxed m-0">
                  {item.description}
                </p>
                <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-[#d0d7de] transition-all duration-200 group-hover:text-purple-600 group-hover:translate-x-0.5" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ComponentView({
  componentKey,
  onBack,
}: {
  componentKey: ComponentKey;
  onBack: () => void;
}) {
  const item = components.find((c) => c.key === componentKey);
  if (!item) return null;

  const Component = item.component;

  return (
    <div className="min-h-screen">
      <div className="fixed top-5 left-5 z-[1000]">
        <button 
          className="inline-flex items-center gap-1.5 bg-white border border-[#e1e4e8] rounded-lg px-3.5 py-2 text-[13px] text-[#57606a] cursor-pointer transition-all duration-200 hover:bg-[#f6f8fa] hover:border-[#d0d7de]"
          onClick={onBack}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          홈으로
        </button>
      </div>
      <Component />
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<ComponentKey>("home");

  const handleNavigate = (key: ComponentKey) => {
    setCurrentView(key);
  };

  const handleBack = () => {
    setCurrentView("home");
  };

  if (currentView === "home") {
    return <HomePage onNavigate={handleNavigate} />;
  }

  return <ComponentView componentKey={currentView} onBack={handleBack} />;
}
