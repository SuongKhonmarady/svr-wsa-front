function TeamSection() {
  const teamMembers = [
    {
      name: "លោក សុខ ស្រេីនុត",
      position: "នាយកប្រតិបត្តិ",
      description: "មានបទពិសោធន៍លើស ២០ឆ្នាំក្នុងការគ្រប់គ្រងធនធានទឹក",
      image: "/image/410640094_122096341784159313_2294110224216625627_n.jpg"
    },
    {
      name: "លោកស្រី ចាន់ សុភា",
      position: "នាយកបច្ចេកទេស",
      description: "ជំនាញពិសេសក្នុងការចម្រាញ់ទឹក និងបច្ចេកវិទ្យាទំនើប",
      image: "/image/410640094_122096341784159313_2294110224216625627_n.jpg"
    },
    {
      name: "លោក វុទ្ធី ចន្ទ្រា",
      position: "នាយកផ្នែកសេវាកម្មអតិថិជន",
      description: "ការធានាសេវាកម្មល្អបំផុតដល់អតិថិជនគ្រប់រូប",
      image: "/image/410640094_122096341784159313_2294110224216625627_n.jpg"
    },
    {
      name: "លោកស្រី ពេជ្រ ស្រីមុំ",
      position: "នាយកផ្នែកហិរញ្ញវត្ថុ",
      description: "ការគ្រប់គ្រងហិរញ្ញវត្ថុប្រកបដោយតម្លាភាព និងប្រសិទ្ធភាព",
      image: "/image/410640094_122096341784159313_2294110224216625627_n.jpg"
    }
  ]

  return (
    <div className="py-16 bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-khmer-title">
            ក្រុមការងាររបស់យើង
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            ក្រុមអ្នកជំនាញដែលមានបទពិសោធន៍ និងចំណេះដឹងជ្រាលជ្រៅ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-6">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                {member.position}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamSection
