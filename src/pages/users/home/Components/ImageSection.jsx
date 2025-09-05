import React, { useState, useEffect, useRef } from 'react';
        

const ImageSection = () => {
    const [visibleSections, setVisibleSections] = useState({
        section1: false,
        section2: false,
        section3: false,
        title: false
    });

    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const titleRef = useRef(null);

    // Array of images with details
    const imageSections = [
        {
            id: 'section1',
            src: "https://cdn.pixabay.com/photo/2020/01/29/22/01/water-4803866_1280.jpg",
            alt: "សកម្មភាពរបស់ក្រុមកាងារ ស.រ.ស - រូបភាពទី១",
            title: "ក្រុមកាងារដែលមានបទពិសោធន៍",
            description: "ផ្តល់សេវាកម្មគុណភាពខ្ពស់ និងគ្រប់គ្រងធនធានទឹកយ៉ាងមានប្រសិទ្ធភាព",
            details: [
                "ក្រុមកាងារដែលមានបទពិសោធន៍ជាង ១០ ឆ្នាំ",
                "ជំនាញវិជ្ជាជីវៈខ្ពស់",
                "គ្រប់គ្រងគម្រោងដែលមានប្រសិទ្ធភាព"
            ]
        },
        {
            id: 'section2',
            src: "https://cdn.pixabay.com/photo/2018/03/19/15/04/faucet-3240211_1280.jpg",
            alt: "សកម្មភាពរបស់ក្រុមកាងារ ស.រ.ស - រូបភាពទី២",
            title: "បច្ចេកវិទ្យាទំនើប",
            description: "ប្រើប្រាស់បច្ចេកវិទ្យាទំនើប និងវិធីសាស្ត្រដែលមានប្រសិទ្ធភាព",
            details: [
                "ប្រើប្រាស់បច្ចេកវិទ្យាទំនើបបំផុត",
                "ប្រព័ន្ធគ្រប់គ្រងដែលមានប្រសិទ្ធភាព",
                "ការវិភាគទិន្នន័យដែលមានគុណភាពខ្ពស់"
            ]
        },
        {
            id: 'section3',
            src: "https://images.unsplash.com/photo-1510148567806-766658eb5b86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "សកម្មភាពរបស់ក្រុមកាងារ ស.រ.ស - រូបភាពទី៣",
            title: "គ្រប់គ្រងធនធានទឹក",
            description: "គ្រប់គ្រងធនធានទឹកយ៉ាងមានប្រសិទ្ធភាព និងប្រកបដោយគុណភាព",
            details: [
                "គ្រប់គ្រងធនធានទឹកយ៉ាងមានប្រសិទ្ធភាព",
                "ការការពារបរិស្ថាន",
                "ការធានាគុណភាពទឹកដែលមានសុវត្ថិភាព"
            ]
        }
    ];

    // Intersection Observer for animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.dataset.section;
                    setVisibleSections(prev => ({
                        ...prev,
                        [targetId]: true
                    }));
                }
            });
        }, observerOptions);

        const refs = [section1Ref, section2Ref, section3Ref, titleRef];
        const sections = ['section1', 'section2', 'section3', 'title'];

        refs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.dataset.section = sections[index];
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div 
                    ref={titleRef}
                    className="text-center mb-16"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${
                        visibleSections.title 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`}>
                        សកម្មភាពរបស់ក្រុមកាងារ ស.រ.ស
                    </h2>
                    <div className={`w-24 h-1 bg-blue-600 mx-auto rounded-full transition-all duration-1000 delay-300 ${
                        visibleSections.title 
                            ? 'opacity-100 scale-x-100' 
                            : 'opacity-0 scale-x-0'
                    }`}></div>
                </div>

                {/* Image Sections */}
                {imageSections.map((section, index) => (
                    <div
                        key={section.id}
                        ref={index === 0 ? section1Ref : index === 1 ? section2Ref : section3Ref}
                        className={`mb-20 last:mb-0 ${
                            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        }`}
                    >
                        <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        }`}>
                            {/* Image */}
                            <div className={`w-full lg:w-1/2 transition-all duration-1000 ${
                                visibleSections[section.id] 
                                    ? 'opacity-100 translate-x-0' 
                                    : index % 2 === 0 
                                        ? 'opacity-0 translate-x-8' 
                                        : 'opacity-0 -translate-x-8'
                            }`}>
                                <div className="overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={section.src}
                                        alt={section.alt}
                                        className="w-full h-64 md:h-80 lg:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 ${
                                visibleSections[section.id] 
                                    ? 'opacity-100 translate-x-0' 
                                    : index % 2 === 0 
                                        ? 'opacity-0 -translate-x-8' 
                                        : 'opacity-0 translate-x-8'
                            }`}>
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                        {section.title}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                        {section.description}
                                    </p>
                                    
                                    {/* Details List */}
                                    <div className="space-y-3">
                                        {section.details.map((detail, detailIndex) => (
                                            <div 
                                                key={detailIndex}
                                                className={`flex items-center space-x-3 transition-all duration-500 delay-${detailIndex * 100} ${
                                                    visibleSections[section.id] 
                                                        ? 'opacity-100 translate-x-0' 
                                                        : 'opacity-0 translate-x-4'
                                                }`}
                                            >
                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                <p className="text-gray-700">{detail}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <div className={`mt-8 transition-all duration-500 delay-500 ${
                                        visibleSections[section.id] 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-4'
                                    }`}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ImageSection;
