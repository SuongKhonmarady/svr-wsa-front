import React, { useEffect, useRef, useState } from 'react';
import SuccessMessage from './Components/sucessMessage';
import PageHeader from './Components/WaterSupplyForm/PageHeader';
import FormHeader from './Components/WaterSupplyForm/FormHeader';
import BasicInformationStep from './Components/WaterSupplyForm/BasicInformationStep';
import DocumentUploadStep from './Components/WaterSupplyForm/DocumentUploadStep';
import ReviewStep from './Components/WaterSupplyForm/ReviewStep';
import NavigationButtons from './Components/WaterSupplyForm/NavigationButtons';
import SubmitMessage from './Components/WaterSupplyForm/SubmitMessage';
import AdditionalInformation from './Components/WaterSupplyForm/AdditionalInformation';
import { useWaterSupplyForm } from './Components/WaterSupplyForm/useWaterSupplyForm';

function WaterSupplyRequest() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [visibleSections, setVisibleSections] = useState({
        title: false,
        subtitle: false,
        buttons: false,
        stats: false
    });

    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);
    const statsRef = useRef(null);

    const {
        // State
        currentStep,
        isStepTransitioning,
        isSubmitting,
        submitMessage,
        isModalOpen,
        formData,
        documents,
        documentPreviews,
        categories,
        privacyAccepted,
        
        // Actions
        handleInputChange,
        handleDocumentChange,
        handleRemoveDocument,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        setIsModalOpen,
        handlePrivacyChange,
        scrollToTop
    } = useWaterSupplyForm();

    useEffect(() => {
        // Form entrance animation delay
        const timer = setTimeout(() => {
            setIsFormVisible(true);
        }, 500);

        // Scroll to top when form loads
        scrollToTop();

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
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

        const refs = [titleRef, subtitleRef, buttonsRef, statsRef];
        const sections = ['title', 'subtitle', 'buttons', 'stats'];

        refs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.dataset.section = sections[index];
                observer.observe(ref.current);
            }
        });

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    const steps = [
        { id: 1, label: 'ព័ត៌មានមូលដ្ឋាន' },
        { id: 2, label: 'អាប់ឡូតឯកសារ' },
        { id: 3, label: 'ពិនិត្យមើល' }
    ];

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInformationStep 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        categories={categories}
                    />
                );
            case 2:
                return (
                    <DocumentUploadStep
                        documents={documents}
                        documentPreviews={documentPreviews}
                        handleDocumentChange={handleDocumentChange}
                        handleRemoveDocument={handleRemoveDocument}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        formData={formData}
                        documentPreviews={documentPreviews}
                        categories={categories}
                        privacyAccepted={privacyAccepted}
                        onPrivacyChange={handlePrivacyChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
            }}
        >
            {/* Page Header */}
            {/* <PageHeader 
                titleRef={titleRef}
                subtitleRef={subtitleRef}
                visibleSections={visibleSections}
            /> */}

            {/* Service Request Form */}
            <div ref={sectionRef} className="bg-white py-16" data-section="form">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 ease-out ${
                        isFormVisible 
                            ? 'opacity-100 transform translate-y-0 scale-100' 
                            : 'opacity-0 transform translate-y-10 scale-95'
                    }`}>
                        {/* Form Header */}
                        <FormHeader currentStep={currentStep} steps={steps} />

                        {/* Form Content */}
                        <div className="px-8 py-6">
                            {/* Submit Message */}
                            <SubmitMessage submitMessage={submitMessage} />

                            {/* Step Content Container with Animation */}
                            <div className={`transition-all duration-300 ${
                                isStepTransitioning 
                                    ? 'opacity-0 transform translate-x-4' 
                                    : 'opacity-100 transform translate-x-0'
                            }`}>
                                {renderCurrentStep()}
                            </div>

                            {/* Navigation Buttons */}
                            <NavigationButtons
                                currentStep={currentStep}
                                isSubmitting={isSubmitting}
                                onPrevStep={handlePrevStep}
                                onNextStep={handleNextStep}
                                onSubmit={handleSubmit}
                                privacyAccepted={privacyAccepted}
                            />
                        </div>
                    </div>

                    {/* Additional Information */}
                    <AdditionalInformation />
                </div>
            </div>

            {/* Render the Modal */}
            <SuccessMessage
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="ជោគជ័យ!"
                message={submitMessage.text}
            />
        </div>
    );
}

export default WaterSupplyRequest;
