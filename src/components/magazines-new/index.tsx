'use client';
import React, { useState } from 'react';
import { ArrowLeft, Upload, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

interface FormData {
  image: File | null;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string;
}

const categories = ['인공지능', '웹개발', '클라우드', '보안', '모바일', '데이터사이언스', '블록체인', 'DevOps'];

export default function MagazinesNew() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    image: null,
    category: '',
    title: '',
    description: '',
    content: '',
    tags: '',
  });

  const handleBackToList = () => {
    router.push('/magazines');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 실제 등록 로직 구현
    console.log('Form submitted:', formData);
    alert('아티클이 등록되었습니다!');
    router.push('/magazines');
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* 뒤로가기 버튼 */}
        <button className={styles.backButton} onClick={handleBackToList}>
          <ArrowLeft className={styles.backIcon} />
          <span>목록으로</span>
        </button>

        {/* 헤더 섹션 */}
        <header className={styles.header}>
          <h1 className={styles.title}>새 아티클 등록</h1>
          <p className={styles.subtitle}>IT 매거진에 새로운 기술 아티클을 등록합니다</p>
        </header>

        {/* 폼 */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 이미지 파일 업로드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>이미지 파일</label>
            <div className={styles.uploadArea}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <label htmlFor="image-upload" className={styles.uploadLabel}>
                <Upload className={styles.uploadIcon} />
                <span className={styles.uploadText}>클릭하여 이미지 선택</span>
                <span className={styles.uploadSubtext}>또는 드래그 앤 드롭</span>
                <span className={styles.uploadFormat}>JPG, PNG, GIF (최대 10MB)</span>
              </label>
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              카테고리 <span className={styles.required}>*</span>
            </label>
            <div className={styles.selectContainer}>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={styles.select}
                required
              >
                <option value="">카테고리를 선택해주세요</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className={styles.selectIcon} />
            </div>
          </div>

          {/* 제목 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="예: 2025년 AI 트렌드: 생성형 AI의 진화"
              className={styles.input}
            />
          </div>

          {/* 한줄 소개 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>한줄 소개</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="아티클을 간단히 소개해주세요 (1-2문장)"
              className={styles.input}
            />
          </div>

          {/* 상세 내용 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>상세 내용</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="아티클의 상세 내용을 작성해주세요..."
              className={styles.textarea}
              rows={10}
            />
          </div>

          {/* 태그 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>태그</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="#React #TypeScript #JavaScript"
              className={styles.input}
            />
            <p className={styles.tagHelp}>공백으로 구분하여 입력해주세요 (예: #React #Node.js #WebDev)</p>
          </div>

          {/* 등록 버튼 */}
          <button type="submit" className={styles.submitButton}>
            아티클 등록하기
          </button>
        </form>
      </div>
    </main>
  );
}
