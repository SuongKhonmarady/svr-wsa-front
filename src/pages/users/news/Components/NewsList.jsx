function NewsList() {
  const newsData = [
    {
      id: 1,
      title: "ការពង្រីកប្រព័ន្ធទឹកស្អាតក្នុងតំបន់ទីក្រុង",
      excerpt: "រដ្ឋករទឹកស្វាយរៀងបានចាប់ផ្តើមគម្រោងពង្រីកប្រព័ន្ធផ្គត់ផ្គង់ទឹកស្អាតដើម្បីបម្រើសហគមន៍បន្ថែមទៀត",
      content: "គម្រោងនេះនឹងអាចផ្គត់ផ្គង់ទឹកស្អាតដល់គ្រួសារបន្ថែម ៥០០០ គ្រួសារទៀត...",
      date: "០៥ កុម្ភៈ ២០២៥",
      category: "ការអភិវឌ្ឍន៍",
      author: "លោក សុខ ស្រេីនុត",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "បច្ចេកវិទ្យាថ្មីសម្រាប់ការចម្រាញ់ទឹក",
      excerpt: "ការដំឡើងប្រព័ន្ធចម្រាញ់ទឹកទំនើបដើម្បីធានាគុណភាពទឹកកាន់តែប្រសើរ",
      content: "ប្រព័ន្ធចម្រាញ់ទឹកថ្មីនេះអាចយកចេញនូវបាក់តេរីហាមព្រាម និងសារធាតុបំពុល...",
      date: "០២ កុម្ភៈ ២០២៥",
      category: "បច្ចេកវិទ្យា",
      author: "លោកស្រី ចាន់ សុភា",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 3,
      title: "កម្មវិធីអប់រំស្តីពីការប្រើប្រាស់ទឹកប្រកបដោយប្រសិទ្ធភាព",
      excerpt: "ការបង្រៀនសហគមន៍អំពីការប្រើប្រាស់ទឹកប្រកបដោយប្រសិទ្ធភាព និងការអភិរក្ស",
      content: "កម្មវិធីនេះមានគោលបំណងលើកកម្ពស់ការយល់ដឹងរបស់សហគមន៍...",
      date: "២៨ មករា ២០២៥",
      category: "សហគមន៍",
      author: "លោក វុទ្ធី ចន្ទ្រា",
      image: "https://images.unsplash.com/photo-1594736797933-d0e501ba2fe8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 4,
      title: "ការធ្វើតេស្តគុណភាពទឹកប្រចាំខែ",
      excerpt: "លទ្ធផលការធ្វើតេស្តគុណភាពទឹកប្រចាំខែមករា បង្ហាញថាទឹកមានគុណភាពល្អ",
      content: "ការធ្វើតេស្តគុណភាពទឹកជាប្រចាំគឺជាកិច្ចការសំខាន់...",
      date: "២៥ មករា ២០២៥",
      category: "គុណភាព",
      author: "លោកស្រី ពេជ្រ ស្រីមុំ",
      image: "https://images.unsplash.com/photo-1559493748-11b98480cc4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 5,
      title: "កម្មវិធីបណ្តុះបណ្តាលបុគ្គលិកថ្មី",
      excerpt: "ការបណ្តុះបណ្តាលបុគ្គលិកថ្មីចំនួន ២០ នាក់ក្នុងការដោះស្រាយបញ្ហាបច្ចេកទេស",
      content: "ការបណ្តុះបណ្តាលនេះមានគោលបំណងបង្កើនសមត្ថភាពបុគ្គលិក...",
      date: "២០ មករា ២០២៥",
      category: "ការបណ្តុះបណ្តាល",
      author: "លោក សុខ ស្រេីនុត",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 6,
      title: "ការចុះកិច្ចសន្យាជាមួយអ្នកផ្គត់ផ្គង់ថ្មី",
      excerpt: "រដ្ឋករទឹកស្វាយរៀងបានចុះកិច្ចសន្យាជាមួយក្រុមហ៊ុនផ្គត់ផ្គង់គ្រឿងបរិក្ខារថ្មី",
      content: "កិច្ចសន្យានេះនឹងធានាថាយើងមានគ្រឿងបរិក្ខារគុណភាពល្អ...",
      date: "១៥ មករា ២០២៥",
      category: "អាជីវកម្ម",
      author: "លោកស្រី ចាន់ សុភា",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    }
  ]

  const categories = ["ទាំងអស់", "ការអភិវឌ្ឍន៍", "បច្ចេកវិទ្យា", "សហគមន៍", "គុណភាព", "ការបណ្តុះបណ្តាល", "អាជីវកម្ម"]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured News */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
            ព័ត៌មានសំខាន់
          </h2>
          {newsData.filter(news => news.featured).map((news) => (
            <div key={news.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="text-sm text-gray-500 mb-4">
                    {news.date} • ដោយ {news.author}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {news.excerpt}
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    អានបន្ថែម
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-khmer-title">
            ព័ត៌មានថ្មីៗទាំងអស់
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.filter(news => !news.featured).map((news) => (
              <article key={news.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3">
                    {news.date} • {news.author}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>
                  
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
                    អានបន្ថែម →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            មើលព័ត៌មានបន្ថែម
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsList
