---
name: "ui-ux-pro"
description: "Provides professional UI/UX design intelligence for web and mobile apps. Invoke when user wants to improve UI design, add new UI components, or optimize user experience."
---

# UI/UX Pro - Professional Design Intelligence

A comprehensive design skill for creating modern, beautiful, and user-friendly interfaces.

## When to Use

- User wants to improve UI/UX design
- Creating new UI components or pages
- Adding animations and transitions
- Optimizing color schemes and typography
- Enhancing user experience

---

## 🎨 Design Principles

### 1. Hierarchy & Visual Hierarchy
```
Primary → Secondary → Tertiary
(最大/最醒目) (中等强调) (辅助信息)
```

### 2. Spacing System (8pt Grid)
- `xs`: 4px (紧凑元素)
- `sm`: 8px (小间距)
- `md`: 16px (标准间距)
- `lg`: 24px (大间距)
- `xl`: 32px (区块间距)
- `2xl`: 48px (页面间距)

### 3. Typography Scale
```
text-xs:   12px - 辅助信息、次要标签
text-sm:   14px - 正文小字、按钮文字
text-base: 16px - 正文标准
text-lg:   18px - 副标题
text-xl:   20px - 标题
text-2xl:  24px - 大标题
text-3xl:  30px - 页面标题
text-4xl:  36px - 超大标题
```

---

## 🎯 Color Systems

### Primary Color Palette (推荐)
```css
Primary Blue:
- 50:  #EFF6FF  (hover背景)
- 100: #DBEAFE  (标签背景)
- 200: #BFDBFE  (边框hover)
- 300: #93C5FD  (次要强调)
- 400: #60A5FA  (图标颜色)
- 500: #3B82F6  (主按钮)
- 600: #2563EB  (主按钮hover)
- 700: #1D4ED8  (深强调)
- 800: #1E40AF  (深色文字)
- 900: #1E3A8A  (最深文字)

Neutral (中性灰):
- 50:  #F9FAFB
- 100: #F3F4F6
- 200: #E5E7EB
- 300: #D1D5DB
- 400: #9CA3AF
- 500: #6B7280
- 600: #4B5563
- 700: #374151
- 800: #1F2937
- 900: #111827
```

### Semantic Colors
```css
Success:  #10B981 (绿色 - 成功状态)
Warning:  #F59E0B (黄色 - 警告状态)
Error:    #EF4444 (红色 - 错误状态)
Info:     #3B82F6 (蓝色 - 信息提示)
```

### Gradients (现代感)
```css
/* 柔和渐变 - 推荐 */
bg-gradient-to-r from-blue-500 to-purple-600
bg-gradient-to-r from-cyan-500 to-blue-500
bg-gradient-to-r from-purple-500 to-pink-500

/* 暗色渐变 */
bg-gradient-to-br from-gray-900 to-gray-800
```

---

## 🔤 Typography Guidelines

### Font Pairings (Google Fonts)

#### 1. 现代简约 (推荐)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- Inter - 现代、清晰、专业 -->
```

#### 2. 中文优雅
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- Noto Sans SC + Inter -->
```

#### 3. 科技感
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- JetBrains Mono - 代码块 -->
```

---

## 🧩 Component Design Patterns

### 1. Card Design
```tsx
// 现代卡片 - 带阴影和hover效果
<div className="
  bg-white 
  rounded-xl 
  shadow-lg 
  hover:shadow-xl 
  transition-all 
  duration-300 
  hover:-translate-y-1
  overflow-hidden
">
  {/* 内容 */}
</div>
```

### 2. Button Design
```tsx
// 主按钮
<button className="
  bg-blue-600 
  hover:bg-blue-700 
  text-white 
  font-semibold 
  py-3 px-6 
  rounded-lg 
  transition-all 
  duration-200 
  hover:shadow-lg 
  hover:-translate-y-0.5
  active:translate-y-0
  active:shadow-md
">
  按钮文字
</button>

// 次要按钮
<button className="
  bg-white 
  border-2 border-gray-200 
  hover:border-blue-500 
  hover:text-blue-600 
  text-gray-700 
  font-medium 
  py-2 px-5 
  rounded-lg 
  transition-colors
">
  次要按钮
</button>
```

### 3. Input Design
```tsx
<input className="
  w-full 
  px-4 py-3 
  border-2 border-gray-200 
  rounded-lg
  focus:border-blue-500 
  focus:ring-4 
  focus:ring-blue-500/10
  outline-none
  transition-all
  placeholder:text-gray-400
"/>
```

### 4. Badge/Tag Design
```tsx
<span className="
  inline-flex 
  items-center 
  px-3 py-1 
  rounded-full
  text-sm font-medium
  bg-blue-100 
  text-blue-800
  hover:bg-blue-200
  transition-colors
  cursor-pointer
">
  标签文字
</span>
```

---

## ✨ Animations & Transitions

### Timing Functions
```css
transition-timing-function:
  ease-in-out    /* 柔和开始和结束 - 推荐 */
  ease-out       /* 平滑减速 */
  ease-in        /* 平滑加速 */
  linear         /* 匀速运动 */
```

### Durations
```css
duration-150  /* 快速 - hover状态 */
duration-200  /* 标准 - 按钮 */
duration-300  /* 适中 - 卡片展开 */
duration-500  /* 慢速 - 页面过渡 */
```

### Animation Patterns

#### 1. Hover Lift Effect
```tsx
<div className="
  transition-all 
  duration-300 
  hover:-translate-y-1 
  hover:shadow-lg
">
  悬浮上移效果
</div>
```

#### 2. Fade In Up (滚动动画)
```tsx
<div className="
  animate-fade-in-up
">
  淡入上移动画
</div>

<style>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}
</style>
```

#### 3. Scale on Hover
```tsx
<button className="
  transition-transform 
  duration-200 
  hover:scale-105
  active:scale-95
">
  缩放效果
</button>
```

#### 4. Gradient Shift on Hover
```tsx
<button className="
  bg-gradient-to-r 
  from-blue-500 
  to-purple-500
  hover:from-blue-600 
  hover:to-purple-600
  transition-all 
  duration-300
">
  渐变悬停
</button>
```

---

## 📐 Layout Patterns

### 1. Responsive Grid
```tsx
// 移动优先的响应式网格
<div className="
  grid 
  grid-cols-1        // 移动端: 1列
  md:grid-cols-2     // 平板: 2列
  lg:grid-cols-3      // 桌面: 3列
  xl:grid-cols-4      // 大屏: 4列
  gap-6              // 间距
">
  {children}
</div>
```

### 2. Container
```tsx
<div className="
  container          // 最大宽度
  mx-auto            // 水平居中
  px-4              // 移动端内边距
  sm:px-6           // 平板内边距
  lg:px-8           // 桌面内边距
">
  内容
</div>
```

### 3. Section Spacing
```tsx
<section className="
  py-12            // 移动端上下间距
  sm:py-16         // 平板
  lg:py-24         // 桌面
">
  区块内容
</section>
```

---

## 🎭 Modern Design Styles

### 1. Glassmorphism (毛玻璃)
```tsx
<div className="
  backdrop-blur-md
  bg-white/10
  border border-white/20
  rounded-2xl
  shadow-xl
">
  毛玻璃效果
</div>
```

### 2. Soft Shadow
```tsx
// 柔和阴影 - 推荐现代设计
shadow-2xl shadow-gray-200/50

// 分层阴影
shadow-lg shadow-blue-500/10

// 柔和圆形阴影
shadow-[0_8px_30px_rgb(0,0,0,0.12)]
```

### 3. Border Radius
```tsx
// 现代圆角规范
rounded-lg    // 8px   - 按钮、输入框
rounded-xl    // 12px  - 卡片
rounded-2xl   // 16px  - 大卡片
rounded-full  // 圆形  - 头像、徽章
```

---

## 🛠️ Tailwind CSS Best Practices

### 1. Class Ordering (推荐顺序)
```tsx
<div className="
  // 1. 布局 (position, display, flex/grid)
  flex items-center justify-between
  
  // 2. 尺寸 (width, height, padding, margin)
  w-full max-w-2xl p-6 mx-auto
  
  // 3. 背景和边框
  bg-white border border-gray-200 rounded-xl
  
  // 4. 文字属性
  text-lg font-semibold text-gray-900
  
  // 5. 交互状态
  hover:bg-gray-50 focus:ring-2 transition-all duration-200
  
  // 6. 位置和层级
  relative z-10
">
  内容
</div>
```

### 2. Color Opacity
```tsx
// 使用 / 表示透明度
bg-blue-500/10      // 10% 透明度
bg-blue-500/50      // 50% 透明度
text-gray-900/80    // 80% 透明度
border-gray-200/50  // 50% 透明度
```

### 3. Responsive Classes
```tsx
// 移动优先
<div className="
  text-base         // 移动端默认
  md:text-lg        // ≥768px
  lg:text-xl        // ≥1024px
  xl:text-2xl       // ≥1280px
">
  响应式文字
</div>
```

---

## 💡 Quick Reference

### Hover States
```tsx
hover:bg-color-100      // 背景变亮
hover:text-color-700     // 文字变深
hover:scale-105         // 轻微放大
hover:-translate-y-1     // 上移
hover:shadow-lg          // 阴影加深
hover:border-color-500  // 边框变色
```

### Focus States
```tsx
focus:outline-none
focus:ring-2 focus:ring-color-500/20
focus:border-color-500
```

### Active States
```tsx
active:scale-95
active:bg-color-600
```

### Disabled States
```tsx
disabled:opacity-50
disabled:cursor-not-allowed
disabled:hover:bg-color-100
```

---

## 🚀 Implementation Checklist

When designing UI components, always ensure:

- [ ] **Accessibility**
  - Sufficient color contrast (WCAG AA minimum)
  - Focus states for keyboard navigation
  - Semantic HTML elements
  - Alt text for images

- [ ] **Responsiveness**
  - Mobile-first approach
  - Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
  - Touch-friendly tap targets (min 44x44px)

- [ ] **Performance**
  - Optimize images with lazy loading
  - Minimize animation complexity
  - Use CSS transforms for animations (GPU acceleration)

- [ ] **Consistency**
  - Use consistent spacing scale (8pt grid)
  - Reuse color palette throughout
  - Maintain typography hierarchy
  - Keep component patterns consistent

---

## Examples

### Example 1: Modern Hero Section
```tsx
<section className="
  relative 
  min-h-[600px] 
  flex items-center 
  justify-center
  bg-gradient-to-br 
  from-blue-50 
  to-purple-50
  overflow-hidden
">
  {/* 背景装饰 */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
  
  <div className="relative z-10 container mx-auto px-4 text-center">
    <h1 className="
      text-4xl md:text-5xl lg:text-6xl
      font-bold 
      text-gray-900 
      mb-6
      animate-fade-in-up
    ">
      欢迎来到我的博客
    </h1>
    <p className="
      text-lg md:text-xl
      text-gray-600
      max-w-2xl 
      mx-auto 
      mb-8
    ">
      分享技术心得，记录生活点滴
    </p>
    <button className="
      bg-blue-600 
      hover:bg-blue-700 
      text-white 
      font-semibold 
      py-4 px-8 
      rounded-full 
      shadow-lg 
      hover:shadow-xl 
      transition-all 
      duration-300 
      hover:-translate-y-1
    ">
      开始探索
    </button>
  </div>
</section>
```

### Example 2: Article Card
```tsx
<article className="
  bg-white 
  rounded-2xl 
  shadow-lg 
  hover:shadow-2xl 
  overflow-hidden
  transition-all 
  duration-300
  hover:-translate-y-2
  group
">
  {/* 图片 */}
  <div className="relative h-48 overflow-hidden">
    <img 
      src={coverImage} 
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
  
  {/* 内容 */}
  <div className="p-6">
    <h3 className="
      text-xl font-bold 
      text-gray-900 
      mb-3
      group-hover:text-blue-600
      transition-colors
    ">
      {title}
    </h3>
    <p className="
      text-gray-600 
      text-sm 
      mb-4
      line-clamp-3
    ">
      {summary}
    </p>
    
    {/* 标签 */}
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <span className="
          bg-blue-50 
          text-blue-600 
          text-xs 
          font-medium 
          px-3 py-1 
          rounded-full
        ">
          {tag}
        </span>
      ))}
    </div>
    
    {/* 日期 */}
    <time className="text-sm text-gray-400">
      {formatDate(date)}
    </time>
  </div>
</article>
```

---

## Summary

This skill provides comprehensive design guidelines for creating beautiful, modern interfaces. Always reference these patterns when:

- Creating new components
- Improving existing UI
- Adding animations
- Choosing colors and typography
- Implementing responsive design

**Remember**: Good design is invisible - it should enhance user experience without drawing attention to itself.
