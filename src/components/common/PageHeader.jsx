function PageHeader({ title, subtitle, description, backgroundImage }) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      )}
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-khmer-title">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl sm:text-2xl text-blue-100 mb-6">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
          <path d="M0 20L100 0V20H0Z" fill="rgb(249 250 251)" />
        </svg>
      </div>
    </div>
  )
}

export default PageHeader
