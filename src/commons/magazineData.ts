// 공통 매거진 데이터 타입 및 데이터
export interface MagazineArticle {
  id: number;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  content: string[];
}

export const magazineData: MagazineArticle[] = [
  {
    id: 0,
    image:
      'https://images.unsplash.com/photo-1745674684463-62f62cb88d4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzYwOTk2ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '인공지능',
    categoryColor: 'purple',
    title: '2025년 AI 트렌드: 생성형 AI의 진화와 미래',
    description: 'ChatGPT를 넘어서는 차세대 AI 기술과 산업 전반의 변화를 심층적으로 살펴봅니다',
    tags: ['#생성형AI', '#멀티모달', '#ChatGPT', '#머신러닝', '#GPT-4', '#디지털전환'],
    date: '2025년 10월 21일',
    content: [
      '생성형 AI 기술은 2024년을 거치며 폭발적인 성장을 보였습니다. ChatGPT, Midjourney, DALL-E 3 등의 서비스가 대중화되면서 누구나 AI를 활용해 콘텐츠를 생성할 수 있는 시대가 열렸습니다. 하지만 이것은 시작에 불과합니다. 2025년에는 더욱 진화된 AI 기술이 우리 곁에 다가올 것입니다.',
      '멀티모달 AI는 텍스트, 이미지, 오디오, 비디오 등 다양한 형태의 데이터를 동시에 이해하고 생성할 수 있는 AI입니다. OpenAI의 GPT-4V, Google의 Gemini 등이 이미 이러한 능력을 선보였으며, 2025년에는 이러한 기술이 더욱 정교해질 것입니다. 예를 들어, 사진 한 장을 보여주면 AI가 그 장면을 설명하고, 관련된 음악을 작곡하고, 그 분위기를 담은 영상까지 제작할 수 있게 됩니다.',
      '기업들은 이미 AI를 핵심 경쟁력으로 인식하고 있습니다. 고객 서비스에서는 AI 챗봇이 인간 상담원 수준의 대화를 제공하며, 마케팅에서는 개인화된 콘텐츠를 자동으로 생성합니다. 제조업에서는 AI가 설계를 최적화하고, 의료 분야에서는 질병 진단과 치료 계획 수립을 지원합니다. 이러한 변화는 단순히 업무를 자동화하는 것을 넘어, 완전히 새로운 비즈니스 모델을 창출하고 있습니다.',
      '교육 분야에서도 AI의 역할이 확대되고 있습니다. 개인 맞춤형 학습 시스템은 각 학생의 학습 속도와 이해도를 분석해 최적의 커리큘럼을 제공합니다. AI 튜터는 24시간 언제든지 질문에 답하고, 학생의 약점을 파악해 집중적으로 학습할 수 있도록 돕습니다. 이는 교육의 접근성을 높이고, 모든 학생이 자신의 잠재력을 최대한 발휘할 수 있는 기회를 제공합니다.',
      '물론 AI의 발전과 함께 우려도 존재합니다. 딥페이크 기술의 악용, 개인정보 보호 문제, AI가 만든 콘텐츠의 저작권 논란 등은 해결해야 할 과제입니다. 또한 AI로 인한 일자리 변화에 대비해 교육과 재훈련 프로그램이 필요합니다. 하지만 이러한 도전을 슬기롭게 해결한다면, AI는 인류의 삶을 크게 개선하는 도구가 될 것입니다.',
      "2025년 AI 트렌드의 핵심은 '실용화'와 '보편화'입니다. 더 이상 AI는 미래의 기술이 아닌, 일상에서 자연스럽게 사용하는 도구가 되고 있습니다. 기업과 개인 모두 AI를 어떻게 활용할 것인지 고민하고, 준비해야 할 때입니다.",
    ],
  },
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYxMDMxNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '웹개발',
    categoryColor: 'green',
    title: 'React 19와 Next.js 15: 프론트엔드의 새로운 시대',
    description: '최신 프론트엔드 프레임워크의 혁신적인 기능과 개발자 경험 개선을 알아봅니다',
    tags: ['#React', '#Next.js', '#서버컴포넌트', '#프론트엔드'],
    date: '2025년 10월 20일',
    content: [
      'React 19는 프론트엔드 개발에 혁신적인 변화를 가져왔습니다. 새로운 컴파일러와 서버 컴포넌트는 개발자 경험을 크게 향상시키고 있습니다.',
      'Next.js 15는 App Router의 완성도를 높이고, 성능 최적화와 개발자 도구를 대폭 개선했습니다.',
      '이러한 변화는 웹 개발의 패러다임을 바꾸고 있으며, 더 나은 사용자 경험을 제공할 수 있게 해줍니다.',
    ],
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1691435828932-911a7801adfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIybmV0d29ya3xlbnwxfHx8fDE3NjEwMTA1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '클라우드',
    categoryColor: 'blue',
    title: '멀티클라우드 전략: 기업의 필수 선택',
    description: 'AWS, Azure, GCP를 활용한 효율적인 클라우드 인프라 구축 방법',
    tags: ['#AWS', '#Azure', '#GCP', '#쿠버네티스'],
    date: '2025년 10월 19일',
    content: [
      '멀티클라우드 전략은 현대 기업의 필수가 되었습니다. 단일 클라우드 공급업체에 의존하는 것은 위험할 수 있습니다.',
      'AWS, Azure, GCP 각각의 장단점을 이해하고 적절히 조합하여 사용하는 것이 중요합니다.',
      '쿠버네티스를 활용한 멀티클라우드 관리가 핵심입니다.',
    ],
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1633250391894-397930e3f5f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjEwMTQ1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '보안',
    categoryColor: 'red',
    title: '제로 트러스트 보안: 더 이상 선택이 아닌 필수',
    description: '클라우드 시대의 새로운 보안 패러다임과 구현 전략을 소개합니다',
    tags: ['#제로트러스트', '#사이버보안', '#MFA', '#랜섬웨어'],
    date: '2025년 10월 18일',
    content: [
      '제로 트러스트 보안 모델은 "절대 신뢰하지 말고 항상 검증하라"는 원칙을 따릅니다.',
      '네트워크 경계가 사라진 현대 환경에서 필수적인 보안 전략입니다.',
      'MFA와 지속적인 모니터링이 핵심 요소입니다.',
    ],
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIyZGFzaGJvYXJkfGVufDF8fHx8MTc2MTA5MzM1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '모바일',
    categoryColor: 'pink',
    title: '크로스 플랫폼 개발의 미래: Flutter vs React Native',
    description: '하나의 코드로 iOS와 Android를 동시에 개발하는 최신 기술 비교',
    tags: ['#Flutter', '#ReactNative', '#크로스플랫폼', '#모바일앱'],
    date: '2025년 10월 17일',
    content: [
      'Flutter와 React Native는 크로스 플랫폼 모바일 개발의 양대 산맥입니다.',
      'Flutter는 Google의 Dart 언어를 사용하며 네이티브 성능을 제공합니다.',
      'React Native는 JavaScript 생태계의 풍부함을 활용할 수 있습니다.',
    ],
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1549399905-5d1bad747576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MDk5OTg5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '데이터사이언스',
    categoryColor: 'orange',
    title: '빅데이터 분석의 새로운 지평: 실시간 처리의 중요성',
    description: 'Apache Kafka와 Spark를 활용한 대규모 데이터 스트리밍 분석',
    tags: ['#빅데이터', '#Kafka', '#Spark', '#실시간분석'],
    date: '2025년 10월 16일',
    content: [
      '실시간 데이터 처리는 현대 비즈니스의 핵심입니다.',
      'Apache Kafka는 대용량 스트리밍 데이터를 처리하는 강력한 도구입니다.',
      'Spark와의 조합으로 실시간 분석이 가능합니다.',
    ],
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1745674684463-62f62cb88d4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzYwOTk2ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '블록체인',
    categoryColor: 'teal',
    title: 'Web3의 현실: 블록체인이 바꾸는 인터넷',
    description: '탈중앙화 기술이 가져올 디지털 소유권과 프라이버시의 혁명',
    tags: ['#Web3', '#블록체인', '#NFT', '#DeFi'],
    date: '2025년 10월 15일',
    content: [
      'Web3는 인터넷의 새로운 패러다임을 제시합니다.',
      '블록체인 기술을 통해 탈중앙화된 서비스를 구축할 수 있습니다.',
      'NFT와 DeFi는 새로운 디지털 경제를 만들어가고 있습니다.',
    ],
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYxMDMxNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'DevOps',
    categoryColor: 'indigo',
    title: 'DevOps에서 Platform Engineering으로의 전환',
    description: '개발자 경험을 혁신하는 내부 개발자 플랫폼 구축 가이드',
    tags: ['#DevOps', '#Platform Engineering', '#IDP', '#개발자경험'],
    date: '2025년 10월 14일',
    content: [
      'Platform Engineering은 DevOps의 진화된 형태입니다.',
      '내부 개발자 플랫폼(IDP) 구축이 핵심입니다.',
      '개발자 경험(DX) 향상에 집중합니다.',
    ],
  },
];

// ID로 매거진 데이터를 가져오는 함수
export const getMagazineById = (id: number): MagazineArticle | undefined => {
  return magazineData.find((article) => article.id === id);
};
