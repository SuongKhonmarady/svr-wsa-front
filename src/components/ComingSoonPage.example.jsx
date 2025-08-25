import React from 'react';
import ComingSoonPage from './ComingSoonPage';

// Example 1: Basic usage with default props
function BasicExample() {
  return <ComingSoonPage />;
}

// Example 2: Custom title and description
function CustomExample() {
  return (
    <ComingSoonPage
      title="ទំព័រសេវាកម្ម"
      subtitle="Services Coming Soon"
      description="ទំព័រសេវាកម្មកំពុងស្ថិតក្នុងដំណើរការអភិវឌ្ឍន៍។"
      englishDescription="Our services page is currently under development."
      progress={60}
      estimatedCompletion="ពាក់កណ្តាលខែក្រោយ"
      estimatedCompletionEn="Mid next month"
    />
  );
}

// Example 3: Custom features
function CustomFeaturesExample() {
  const customFeatures = [
    { icon: "🏠", title: "ផ្ទះ", subtitle: "Housing Services" },
    { icon: "🚗", title: "រថយន្ត", subtitle: "Vehicle Services" },
    { icon: "💼", title: "អាជីវកម្ម", subtitle: "Business Services" },
    { icon: "🎓", title: "ការអប់រំ", subtitle: "Education Services" }
  ];

  return (
    <ComingSoonPage
      title="ទំព័រសេវាកម្មផ្សេងៗ"
      subtitle="Various Services"
      features={customFeatures}
      progress={45}
      showContact={false}
    />
  );
}

// Example 4: Minimal version
function MinimalExample() {
  return (
    <ComingSoonPage
      title="កំពុងអភិវឌ្ឍន៍"
      subtitle="Under Development"
      showContact={false}
      showHomeButton={false}
      progress={30}
    />
  );
}

export { BasicExample, CustomExample, CustomFeaturesExample, MinimalExample };
