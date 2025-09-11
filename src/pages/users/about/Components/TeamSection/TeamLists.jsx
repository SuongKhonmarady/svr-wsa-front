import React from 'react'

function TeamLists() {
  const teamMembers = {
    director: [
      {
        name: "លោក A",
        position: "អគ្គនាយក",
        image: "/image/wusvr-logo(2).png"
      }
    ],
    managers: [
      {
        name: "លោក B",
        position: "អគ្គនាយករង",
        description: "ជំនាញពិសេសក្នុងការចម្រាញ់ទឹក និងបច្ចេកវិទ្យាទំនើប",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក C",
        position: "អគ្គនាយករង",
        description: "ការធានាសេវាកម្មល្អបំផុតដល់អតិថិជនគ្រប់រូប",
        image: "/image/wusvr-logo(2).png"
      }
    ],
    supervisors: [
      {
        name: "លោក D",
        position: "ប្រធាន",
        description: "ការគ្រប់គ្រងផ្នែកបច្ចេកទេស",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក E",
        position: "ប្រធាន",
        description: "ការគ្រប់គ្រងផ្នែកសេវាកម្មអតិថិជន",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក F",
        position: "ប្រធាន",
        description: "ការគ្រប់គ្រងផ្នែកហិរញ្ញវត្ថុ",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក G",
        position: "ប្រធាន",
        description: "ការគ្រប់គ្រងផ្នែកធនធានមនុស្ស",
        image: "/image/wusvr-logo(2).png"
      }
    ],
    staff: [
      {
        name: "លោក H",
        position: "បុគ្គលិក",
        description: "ជំនាញបច្ចេកទេស",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក I",
        position: "បុគ្គលិក",
        description: "ជំនាញសេវាកម្មអតិថិជន",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក J",
        position: "បុគ្គលិក",
        description: "ជំនាញហិរញ្ញវត្ថុ",
        image: "/image/wusvr-logo(2).png"
      },
      {
        name: "លោក K",
        position: "បុគ្គលិក",
        description: "ជំនាញធនធានមនុស្ស",
        image: "/image/wusvr-logo(2).png"
      }
    ]
  }

  const renderTeamSection = (title, members, gridCols, delayMultiplier = 1, isSmall = false) => (
    <div className="mb-8">
      {/* Section Header */}
      <div className="text-center mb-6">

        <h3 className="text-xl font-bold text-gray-900 mb-2 font-khmer-title">
          {title}
        </h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
      </div>

             {/* Team Cards Grid */}
       {gridCols === 1 ? (
         <div className="flex justify-center">
           {members.map((member, index) => (
             <div 
               key={index} 
               className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full max-w-xs"
               style={{
                 animationDelay: `${index * 100 * delayMultiplier}ms`
               }}
             >
              {/* Card Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-50"></div>
              
              {/* Card Content */}
              <div className="relative p-4 text-center">
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-3 border-white shadow-lg"
                      onError={(e) => {
                        e.target.src = '/image/410640094_122096341784159313_2294110224216625627_n.jpg';
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-xs font-medium shadow-sm">
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    {member.position}
                  </div>
                  {member.description && (
                    <p className="text-gray-600 leading-relaxed mt-2 text-xs">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
                 <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${gridCols} gap-4 lg:gap-6 justify-items-center`}>
           {members.map((member, index) => (
             <div 
               key={index} 
               className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full max-w-xs"
               style={{
                 animationDelay: `${index * 100 * delayMultiplier}ms`
               }}
             >
              {/* Card Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-50"></div>
              
              {/* Card Content */}
              <div className="relative p-4 text-center">
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-3 border-white shadow-lg"
                      onError={(e) => {
                        e.target.src = '/image/410640094_122096341784159313_2294110224216625627_n.jpg';
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-xs font-medium shadow-sm">
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    {member.position}
                  </div>
                  {member.description && (
                    <p className="text-gray-600 leading-relaxed mt-2 text-xs">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* នាយកប្រតិបត្តិ - Top Level */}
      {renderTeamSection("នាយកប្រតិបត្តិ", teamMembers.director, 1, 1, false)}
      
      {/* នាយករង - Second Level */}
      {renderTeamSection("នាយករង", teamMembers.managers, 2, 2, false)}
      
      {/* ប្រធាន - Third Level */}
      {renderTeamSection("ប្រធាន", teamMembers.supervisors, 4, 3, false)}
      
      {/* បុគ្គលិក - Staff Level */}
      {renderTeamSection("បុគ្គលិក", teamMembers.staff, 4, 4, false)}
    </div>
  )
}

export default TeamLists
